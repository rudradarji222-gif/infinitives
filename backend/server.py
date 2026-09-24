from fastapi import FastAPI, APIRouter, HTTPException, Request, UploadFile, File, Response
from starlette.concurrency import run_in_threadpool
import requests as http_requests
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

# Emergent object storage
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "infinitives-healthcare"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = http_requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = http_requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = http_requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

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


class RfqAttachment(BaseModel):
    kind: str = Field(default="document", max_length=40)
    filename: str = Field(default="", max_length=200)
    path: str = Field(default="", max_length=300)


class RfqCreate(BaseModel):
    product_name: str = Field(default="", max_length=200)
    brand_name: str = Field(default="", max_length=200)
    category: str = Field(default="Nutraceutical", max_length=60)
    dosage_form: str = Field(default="Tablets", max_length=60)
    composition: str = Field(default="", max_length=1000)
    strength: str = Field(default="", max_length=100)
    active_count: str = Field(default="", max_length=20)
    target_market: str = Field(default="", max_length=100)
    quantity: int = Field(default=0, ge=0, le=100000000)
    mfg_type: str = Field(default="Contract Manufacturing", max_length=80)
    dev_req: str = Field(default="", max_length=120)
    packaging: str = Field(default="Bottle", max_length=60)
    pack_size: str = Field(default="", max_length=120)
    pack_material: str = Field(default="", max_length=120)
    label_req: str = Field(default="", max_length=120)
    reg_required: bool = False
    has_registration: bool = False
    product_registered: bool = False
    reg_docs: List[str] = []
    dest_country: str = Field(default="", max_length=100)
    dest_port: str = Field(default="", max_length=120)
    shipping: str = Field(default="FOB", max_length=20)
    delivery_date: str = Field(default="", max_length=40)
    name: str = Field(..., min_length=2, max_length=100)
    company: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=30)
    country: str = Field(..., min_length=2, max_length=100)
    website: str = Field(default="", max_length=200)
    position: str = Field(default="", max_length=100)
    message: str = Field(default="", max_length=3000)
    lead_time: str = Field(default="", max_length=40)
    attachments: List[RfqAttachment] = []


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


ALLOWED_UPLOAD_EXTS = {"pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "xls", "xlsx", "csv", "txt"}


@api_router.post("/rfq-upload")
async def rfq_upload(file: UploadFile = File(...), kind: str = "document"):
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 10 MB)")
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "bin"
    if ext not in ALLOWED_UPLOAD_EXTS:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    path = f"{APP_NAME}/rfq/{uuid.uuid4()}.{ext}"
    try:
        result = await run_in_threadpool(put_object, path, data, file.content_type or "application/octet-stream")
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="File upload failed")
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type or "application/octet-stream",
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "filename": file.filename, "size": result.get("size", len(data))}


@api_router.get("/files/{path:path}")
async def download_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = await run_in_threadpool(get_object, path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found in storage")
    fname = (record.get("original_filename") or "file").replace('"', "")
    return Response(
        content=data,
        media_type=record.get("content_type", content_type),
        headers={"Content-Disposition": f'inline; filename="{fname}"'},
    )


def _rfq_row(label, value):
    if value in (None, "", [], 0, False):
        value = "-"
    if value is True:
        value = "Yes"
    if isinstance(value, list):
        value = ", ".join(str(v) for v in value) or "-"
    if isinstance(value, int):
        value = f"{value:,}"
    return (
        f'<tr><td style="padding:8px 14px;font-size:12px;color:#64748b;font-family:Arial,sans-serif;'
        f'border-bottom:1px solid #f1f5f9;white-space:nowrap">{escape(str(label))}</td>'
        f'<td style="padding:8px 14px;font-size:13px;color:#0f172a;font-family:Arial,sans-serif;'
        f'border-bottom:1px solid #f1f5f9">{escape(str(value))}</td></tr>')


def _rfq_section(title):
    return (
        f'<tr><td colspan="2" style="padding:16px 14px 6px;font-family:Arial,sans-serif;font-size:11px;'
        f'font-weight:bold;letter-spacing:2px;color:#e91e63;text-transform:uppercase">{escape(title)}</td></tr>')


@api_router.post("/rfq")
async def create_rfq(payload: RfqCreate, request: Request):
    _rate_check(f"rfq-{request.client.host if request.client else 'unknown'}")
    year = datetime.now(timezone.utc).year
    count = await db.rfqs.count_documents({})
    inquiry_id = f"IH-{year}-{count + 1:05d}"
    doc = payload.dict()
    doc.update({"id": str(uuid.uuid4()), "inquiry_id": inquiry_id, "created_at": datetime.now(timezone.utc)})
    try:
        await db.rfqs.insert_one(doc)
    except Exception as e:
        logger.exception("Failed to save RFQ")
        raise HTTPException(status_code=500, detail=f"Could not save inquiry: {e}")

    proto = request.headers.get("x-forwarded-proto", "https")
    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    base = f"{proto}://{host}"

    attach_rows = ""
    for a in payload.attachments:
        if a.path:
            attach_rows += (
                f'<tr><td style="padding:8px 14px;font-size:12px;color:#64748b;font-family:Arial,sans-serif;'
                f'border-bottom:1px solid #f1f5f9">{escape(a.kind.replace("_", " ").title())}</td>'
                f'<td style="padding:8px 14px;font-size:13px;font-family:Arial,sans-serif;border-bottom:1px solid #f1f5f9">'
                f'<a href="{base}/api/files/{escape(a.path)}" style="color:#0284c7">{escape(a.filename or "Download file")}</a></td></tr>')

    rows = (
        _rfq_section("Client")
        + _rfq_row("Company", payload.company)
        + _rfq_row("Full Name", payload.name)
        + _rfq_row("Business Email", payload.email)
        + _rfq_row("WhatsApp / Phone", payload.phone)
        + _rfq_row("Country", payload.country)
        + _rfq_row("Website", payload.website)
        + _rfq_row("Job Position", payload.position)
        + _rfq_section("Product Details")
        + _rfq_row("Product / Molecule", payload.product_name)
        + _rfq_row("Generic / Brand Name", payload.brand_name)
        + _rfq_row("Category", payload.category)
        + _rfq_row("Dosage Form", payload.dosage_form)
        + _rfq_row("Composition / Formulation", payload.composition)
        + _rfq_row("Strength", payload.strength)
        + _rfq_row("Active Ingredients", payload.active_count)
        + _rfq_row("Target Market", payload.target_market)
        + _rfq_section("Manufacturing")
        + _rfq_row("Manufacturing Type", payload.mfg_type)
        + _rfq_row("Development Requirement", payload.dev_req)
        + _rfq_row("Quantity (units)", payload.quantity)
        + _rfq_row("Estimated Lead Time", payload.lead_time)
        + _rfq_section("Packaging")
        + _rfq_row("Packaging", payload.packaging)
        + _rfq_row("Pack Size", payload.pack_size)
        + _rfq_row("Packaging Material", payload.pack_material)
        + _rfq_row("Label Requirement", payload.label_req)
        + _rfq_section("Regulatory")
        + _rfq_row("Registration Required", payload.reg_required)
        + _rfq_row("Client Has Registration", payload.has_registration)
        + _rfq_row("Product Already Registered", payload.product_registered)
        + _rfq_row("Documentation Required", payload.reg_docs)
        + _rfq_section("Delivery")
        + _rfq_row("Destination Country", payload.dest_country)
        + _rfq_row("Destination City / Port", payload.dest_port)
        + _rfq_row("Shipping Terms", payload.shipping)
        + _rfq_row("Required Delivery Date", payload.delivery_date)
        + _rfq_section("Message")
        + _rfq_row("Additional Requirements", payload.message)
        + (_rfq_section("Attachments") + attach_rows if attach_rows else "")
    )

    subject = f"New RFQ {inquiry_id} - {escape(payload.company)} - {escape(payload.product_name or payload.dosage_form)}"
    html = (
        '<table role="presentation" width="100%" style="background:#f8fafc;padding:24px 0">'
        '<tr><td align="center"><table role="presentation" width="640" '
        'style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">'
        '<tr><td style="background:#090d16;padding:20px 28px;font-family:Arial,sans-serif">'
        '<span style="color:#ec4899;font-weight:bold;font-size:18px">INFINITIVES</span> '
        '<span style="color:#38bdf8;font-weight:bold;font-size:18px">HEALTHCARE</span>'
        f'<div style="color:#f59e0b;font-size:13px;font-weight:bold;margin-top:6px">Inquiry ID: {escape(inquiry_id)}</div>'
        '<div style="color:#94a3b8;font-size:11px;margin-top:2px">Batch Estimator RFQ - Excellence in Every Dose</div></td></tr>'
        '<tr><td style="padding:12px 14px">'
        '<table role="presentation" width="100%" style="border-collapse:collapse">'
        + rows +
        '</table></td></tr>'
        '<tr><td style="padding:16px 28px;background:#f8fafc;font-family:Arial,sans-serif;'
        'font-size:11px;color:#94a3b8">Sent by the Infinitives Healthcare website batch estimator. '
        'We never ask for passwords or card details by email.</td></tr>'
        '</table></td></tr></table>'
    )
    try:
        email_id = await send_email(to=OWNER_EMAIL, subject=subject, html=html)
        await db.rfqs.update_one({"inquiry_id": inquiry_id}, {"$set": {"email_id": email_id}})
    except Exception:
        logger.error(f"RFQ {inquiry_id} saved but email delivery failed")
    return {"inquiry_id": inquiry_id, "status": "received"}


@api_router.get("/rfqs")
async def list_rfqs():
    items = await db.rfqs.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    for i in items:
        if isinstance(i.get("created_at"), datetime):
            i["created_at"] = i["created_at"].isoformat()
    return items


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


@app.on_event("startup")
async def startup_storage():
    try:
        await run_in_threadpool(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
