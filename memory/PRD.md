# PRD — Infinitives Healthcare Website

## Original Problem Statement
Client runs a nutraceutical plant and previously had the NutriEdge Lifescience website (uploaded as zip). Goal: a brand-new website for "INFINITIVES HEALTHCARE" with colors from the logo (magenta-pink, azure blue, amber infinity mark), a bold Nutriva-style layout (oversized typography, floating glass cards), cool animations, content reused from NutriEdge but fully rebranded (no "NutriEdge" anywhere), manufacturing-driven tone, updated contact persons, working inquiry form delivering to info@infinitiveshealthcare.com, multi-language switcher, and a sitemap for Google Search Console.

## User Personas
- Brand owners / supplement companies seeking third-party (contract) manufacturing
- OEM / private-label buyers
- Export/import partners in 15+ countries

## Architecture
- Frontend: React 19 + Tailwind + framer-motion (scroll reveals, masked hero lines, parallax) + Lenis smooth scrolling. Pages: Home, About, Products, ProductDetail (15 categories), R&D, Gallery, Contact.
- Backend: FastAPI, /api prefix. POST /api/inquiries (validates, rate-limits 5/hr/IP, saves to Mongo, emails owner via Emergent managed Resend proxy). GET /api/health, GET /api/inquiries.
- DB: MongoDB via MONGO_URL / DB_NAME.
- i18n: custom context, languages EN / HI / GU / ES / FR (localStorage persisted).
- SEO: /sitemap.xml + /robots.txt in frontend public (base URL = preview domain; update to final domain at go-live).

## Key Decisions
- Address intentionally left as a placeholder card ("Official plant address will be updated here soon") per client request.
- Product/facility photos are placeholder stock images; client will replace with real plant & product photos later.
- Infinity logo recreated as inline SVG (amber + azure loops, magenta core).

## Contact Directory (implemented)
- Mr. Nikunj Patel — Export Division — +91 70417 83028
- Mr. Miraj Sabalpara — Third-Party Manufacturing — +91 98259 59338
- Mr. Vipul Dobariya — OEM — +91 99133 29449
- Email: info@infinitiveshealthcare.com

## Implemented (2026-09-19, v4)
- Logo white background removed (transparent PNG auto-cropped, /assets/logo-transparent.png) — merges into navbar, marquee, hero watermark, why-us medallion; dark surfaces keep a deliberate white pill card
- Heavy brand-intro overlay REMOVED per client feedback; hero reveal is instant again
- New futuristic interactions: cursor-following tri-color glow (desktop), 3D tilt on hero product photo (mouse-tracked), mouse-parallax floating pill chips, magnetic CTA buttons, animated count-up stats (1M+, 15+, 14, 100+)
- Fixed JSX regression: three hero floating cards had className leaking as visible text

## Implemented (2026-09-19, v3)
- Correct official logo (client-uploaded JPEG, used as-is) now everywhere: navbar, mobile menu, footer (white pill card on dark), marquee separators, hero watermark (slow float), why-us medallion, favicon, og:image. Old hand-drawn SVG logo removed
- New front-page animation: brand intro overlay — logo blurs/scales in on white, then slides up to reveal the hero; hero line-reveal choreography re-timed to start after the intro

## Implemented (2026-09-19, v2)
- Real client product photos uploaded per category (all 15 categories, /assets/categories/*.webp) — used on Products grid, Product Detail heroes, Home dosage showcase, Gallery
- Hero center image now uses the real gummy-candy product photo with rotating dashed ring, floating gradient pill chips, and animated ambient orbs
- License/certification badge images (11, from client upload) shown in an infinite sliding strip — new "Licensed & Certified" section on Home and on the R&D page (LicenseSlider component)
- Process section redesigned as capsule cards alternating along a gradient line (Nutralike-style reference)
- Why-Us redesigned as circular hub: spinning dashed-ring logo medallion with 6 numbered cards flanking it
- Scroll progress bar (brand gradient) added at top of every page

## Implemented (2026-09-19, v1)
- Full multi-page site with Nutriva-inspired editorial hero ("EXCELLENCE IN EVERY DOSE" masked line-by-line reveal, floating glass cards, parallax product image, slow marquee)
- Numbered manifesto chapters: 01 Third-Party Mfg, 02 OEM & Private Label, 03 Global Export
- Plant capacity dark bento (1M+ doses/day etc.), 8-step process, 6 principles, global presence (15 countries), certifications strip, testimonials, CTA band
- 15-category product catalogue (225+ formulations) with detail pages
- R&D page with lab capabilities + certification grid; Gallery with facility + dosage formats
- Contact page: 3 executive cards (call + WhatsApp), working inquiry form (DB + email), address placeholder, working hours
- WhatsApp float button (+91 70417 83028)
- Language switcher EN/HI/GU/ES/FR
- sitemap.xml + robots.txt (Search Console ready)
- Email: pipeline verified end-to-end (test send to delivered@resend.dev returned email id). Live delivery to info@infinitiveshealthcare.com currently BLOCKED because that domain has no mailbox/MX set up yet — every inquiry is still stored in the DB regardless.

## Backlog
- P0: Client sets up mailbox for info@infinitiveshealthcare.com (MX records) → emails start arriving automatically
- P0: Client provides plant address → replace placeholder card
- P1: Client's real product/plant photos → swap stock placeholders
- P1: Update sitemap base URL to final custom domain at go-live
- P2: Batch/cost estimator (from design guidelines), catalogue PDF download, Google Map embed once address exists
