from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import ipaddress
import logging
import time
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Infinitives Healthcare API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Emergent managed email proxy — constant by design, never from env
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Infinitives Healthcare")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "info@infinitiveshealthcare.com")

# ---------------- Email guardrail gate (G2/G3 structural checks) ---------------- #
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


# ---------------- Models ---------------- #
class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    company: Optional[str] = Field(default="", max_length=150)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=30)
    inquiry_type: Optional[str] = Field(default="General", max_length=80)
    message: str = Field(..., min_length=5, max_length=3000)

    @field_validator('name', 'phone', 'message')
    @classmethod
    def strip_ws(cls, v: str):
        return v.strip()


class Inquiry(InquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_id: Optional[str] = None


# Simple in-memory rate limit: 5 submissions / hour / IP
_rate_bucket: dict = {}


def _rate_check(ip: str):
    now = time.time()
    hits = [t for t in _rate_bucket.get(ip, []) if now - t < 3600]
    if len(hits) >= 5:
        raise HTTPException(status_code=429, detail="Too many inquiries. Please try again later.")
    hits.append(now)
    _rate_bucket[ip] = hits


# ---------------- Routes ---------------- #
@api_router.get("/")
async def root():
    return {"message": "Infinitives Healthcare API is running"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "infinitives-healthcare"}


@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(payload: InquiryCreate, request: Request):
    _rate_check(request.client.host if request.client else "unknown")
    obj = Inquiry(**payload.dict())
    try:
        doc = obj.dict()
        await db.inquiries.insert_one(doc)
    except Exception as e:
        logger.exception("Failed to save inquiry")
        raise HTTPException(status_code=500, detail=f"Could not save inquiry: {e}")

    subject = f"New Website Inquiry - {escape(obj.inquiry_type)} - {escape(obj.name)}"
    row = lambda label, value: (
        f'<tr><td style="padding:10px 14px;font-size:13px;color:#64748b;'
        f'font-family:Arial,sans-serif;border-bottom:1px solid #f1f5f9">{label}</td>'
        f'<td style="padding:10px 14px;font-size:14px;color:#0f172a;'
        f'font-family:Arial,sans-serif;border-bottom:1px solid #f1f5f9">{value}</td></tr>')
    html = (
        '<table role="presentation" width="100%" style="background:#f8fafc;padding:24px 0">'
        '<tr><td align="center"><table role="presentation" width="560" '
        'style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">'
        '<tr><td style="background:#0f172a;padding:20px 28px;font-family:Arial,sans-serif">'
        '<span style="color:#ec4899;font-weight:bold;font-size:18px">INFINITIVES</span> '
        '<span style="color:#38bdf8;font-weight:bold;font-size:18px">HEALTHCARE</span>'
        '<div style="color:#94a3b8;font-size:11px;margin-top:4px">Excellence in Every Dose</div></td></tr>'
        '<tr><td style="padding:24px 28px">'
        '<p style="font-family:Arial,sans-serif;font-size:15px;color:#0f172a;margin:0 0 16px">'
        'You have received a new inquiry from the website.</p>'
        '<table role="presentation" width="100%" style="border-collapse:collapse">'
        + row("Name", escape(obj.name))
        + row("Company", escape(obj.company or "-"))
        + row("Email", escape(obj.email))
        + row("Phone", escape(obj.phone))
        + row("Inquiry Type", escape(obj.inquiry_type or "General"))
        + row("Message", escape(obj.message).replace("\n", "<br>"))
        + '</table></td></tr>'
        '<tr><td style="padding:16px 28px;background:#f8fafc;font-family:Arial,sans-serif;'
        'font-size:11px;color:#94a3b8">Sent by the Infinitives Healthcare website enquiry form. '
        'We never ask for passwords or card details by email.</td></tr>'
        '</table></td></tr></table>'
    )
    try:
        obj.email_id = await send_email(to=OWNER_EMAIL, subject=subject, html=html)
        await db.inquiries.update_one({"id": obj.id}, {"$set": {"email_id": obj.email_id}})
    except HTTPException:
        logger.error("Inquiry saved but email delivery failed")
    return obj


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries():
    items = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [Inquiry(**i) for i in items]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
