# Smart Calculator — Product Requirements Document

> **Version**: 2.0 | **Date**: May 2026 | **Status**: Ready for Development

---

## 1. Overview

เว็บไซต์รวมเครื่องคำนวณที่ใช้งานง่าย รองรับ 2 ภาษา (ไทย / English) มี SEO ที่ดี พร้อม Google AdSense และ deploy บน production จริงพร้อม domain name — ออกแบบให้เร็ว, สวย, และ scale ได้ง่าย

---

## 2. Calculators (ลำดับเมนู)

| # | Calculator | URL Slug | ชื่อภาษาไทย |
|---|-----------|---------|------------|
| 1 | Unit Converter | `/unit-converter` | แปลงหน่วย |
| 2 | BMI Calculator | `/bmi` | คำนวณ BMI |
| 3 | Age Calculator | `/age-calculator` | คำนวณอายุ |
| 4 | Currency Converter | `/currency-converter` | แปลงสกุลเงิน |
| 5 | Loan Calculator | `/loan-calculator` | คำนวณสินเชื่อ |
| 6 | Percentage Calculator | `/percentage-calculator` | คำนวณเปอร์เซ็นต์ |
| 7 | Calorie Calculator | `/calorie-calculator` | คำนวณแคลอรี่ |
| 8 | Date Calculator | `/date-calculator` | คำนวณวันที่ |
| 9 | Sleep Calculator | `/sleep-calculator` | คำนวณการนอน |
| 10 | GPA Calculator | `/gpa-calculator` | คำนวณ GPA |

---

## 3. Tech Stack

| Layer | Technology | เหตุผล |
|-------|-----------|--------|
| Framework | **Next.js 15** (App Router) + TypeScript | SSR/SSG, routing, performance |
| Styling | **Tailwind CSS** + **shadcn/ui** | สวย, consistent, ไม่ต้อง custom CSS เยอะ |
| i18n | **next-intl** | JSON-based, รองรับ locale routing |
| State Persistence | `localStorage` via custom hook | ไม่ต้องใช้ backend สำหรับส่วนนี้ |
| Database | **Supabase** (PostgreSQL) | Free tier, no config, มี REST API + dashboard พร้อมใช้ |
| Analytics / Log | **Supabase** table + **Vercel Analytics** | เก็บ event หลังบ้าน, ดู dashboard ได้ทันที |
| Error Monitoring | **Sentry** (free tier) | catch runtime error + stack trace |
| Ads | **Google AdSense** | |
| Hosting | **Vercel** | CI/CD อัตโนมัติ, edge network ทั่วโลก |
| Domain | Namecheap / Cloudflare Registrar | ชี้ DNS ไป Vercel |

---

## 4. Pages & Routes (ทุกหน้าที่ต้องมี)

### 4.1 Public Pages

| หน้า | Route | คำอธิบาย |
|------|-------|---------|
| **Home** | `/` | Landing page — แสดง hero, card grid ทุก calculator, stats |
| **Calculator** | `/[slug]` | หน้า calculator แต่ละอัน (10 หน้า) |
| **Announcements** | `/announcements` | บอร์ดประกาศ / อัปเดตข่าวจากเจ้าของเว็บ |
| **Announcement Detail** | `/announcements/[id]` | รายละเอียดประกาศแต่ละรายการ |
| **About** | `/about` | เกี่ยวกับเว็บไซต์ |
| **Privacy Policy** | `/privacy` | นโยบายความเป็นส่วนตัว (required โดย AdSense) |
| **Terms of Service** | `/terms` | ข้อกำหนดการใช้งาน |

### 4.2 Special / System Pages

| หน้า | Route | คำอธิบาย |
|------|-------|---------|
| **404 Not Found** | `/not-found` | หน้า custom 404 — มีลิงก์กลับ Home + แสดงเมนู popular |
| **500 Error** | `error.tsx` | หน้า error boundary — แสดง message + ปุ่ม retry |
| **Loading** | `loading.tsx` | Skeleton UI ระหว่างโหลด (ทุก route segment) |
| **Maintenance** | `/maintenance` | ใช้เมื่อต้องการปิดปรับปรุงชั่วคราว |

### 4.3 Admin Dashboard (Protected)

| หน้า | Route | คำอธิบาย |
|------|-------|---------|
| **Admin Home** | `/admin` | Overview stats: pageviews, top calculators, top events |
| **Analytics** | `/admin/analytics` | ตาราง + กราฟรายละเอียด event logs |
| **Announcements Mgmt** | `/admin/announcements` | CRUD บอร์ดประกาศ |

> Admin ใช้ **Supabase Auth** (magic link หรือ email+password) ไม่ต้องสร้าง auth เอง

---

## 5. Navigation & Layout

### ข้อกำหนดหลัก
- **Sidebar ไม่ reload layout** — ใช้ Next.js App Router nested layout `app/layout.tsx` wrap ครอบ Sidebar + Header เพื่อให้ layout คงเดิมเมื่อเปลี่ยนหน้า เฉพาะ content area ตรงกลางเท่านั้นที่ re-render
- Sidebar ต้องมี smooth scroll และ active highlight ตาม route ปัจจุบัน
- Mobile: Sidebar ซ่อนอยู่ เปิดด้วย hamburger icon — ปิดอัตโนมัติเมื่อเลือกเมนู

### Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Header: Logo | Lang toggle | Dark mode          │
├──────────────┬──────────────────────┬────────────┤
│              │                      │            │
│   Sidebar    │   Content Area       │  Right Ad  │
│   (fixed)    │   (changes per route)│  (desktop) │
│              │                      │            │
│  - Home      │  [Calculator Form]   │  Ad 300x600│
│  - BMI  ●    │  [Result Card]       │            │
│  - Age       │  [Ad in-content]     │            │
│  - ...       │                      │            │
│              │                      │            │
├──────────────┴──────────────────────┴────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

---

## 6. i18n — Multilingual (ไทย / English)

- ข้อความทั้งหมดเก็บใน JSON แยกไฟล์ต่อภาษา — **ไม่มี hardcode text ในโค้ด**
- Language toggle (🇹🇭 TH / 🇬🇧 EN) ที่ header ทุกหน้า
- Default locale: `th` ตาม `Accept-Language` header
- URL locale prefix: `/th/bmi`, `/en/bmi` (หรือ domain-based ก็ได้)

```
/messages/
  th.json    ← ภาษาไทย (primary)
  en.json    ← ภาษาอังกฤษ
```

ตัวอย่างโครงสร้าง JSON:
```json
{
  "common": { "calculate": "คำนวณ", "reset": "ล้างค่า" },
  "bmi": {
    "title": "คำนวณ BMI ออนไลน์",
    "description": "คำนวณดัชนีมวลกาย (BMI) ...",
    "weight": "น้ำหนัก (กก.)",
    "height": "ส่วนสูง (ซม.)"
  }
}
```

---

## 7. State Persistence (ค่าไม่หายหลัง Refresh)

- ทุก calculator บันทึก input + result ลง `localStorage` แบบ real-time (ทุก keystroke)
- Key format: `sc_<slug>_state` เช่น `sc_bmi_state`
- โหลดค่ากลับมาอัตโนมัติทุกครั้งที่เปิดหน้า
- ปุ่ม "ล้างค่า / Reset" เพื่อ clear localStorage ของหน้านั้น
- ใช้ custom hook `useLocalStorage<T>(key, initialValue)` ที่ reuse ได้ทุกหน้า

---

## 8. Google AdSense — 6 ตำแหน่ง

วางโฆษณา 6 จุด โดยเน้น **ไม่รก ไม่บัง content** — ใช้ responsive ad units ทั้งหมด

| # | ตำแหน่ง | ขนาด | แสดงบน | เงื่อนไข |
|---|--------|------|--------|---------|
| 1 | **Top Banner** | Leaderboard 728×90 / responsive | ทุกหน้า ใต้ Header | Desktop + Mobile |
| 2 | **In-Content Top** | Responsive (auto) | เหนือ calculator form เล็กน้อย | ทุกหน้า calculator |
| 3 | **In-Content Middle** | Responsive (auto) | ระหว่าง form กับ result card | ทุกหน้า calculator |
| 4 | **Right Sidebar Ad** | 300×600 Half Page | Desktop sidebar ขวา | Desktop เท่านั้น |
| 5 | **Below Result** | Responsive (auto) | หลัง result card | ทุกหน้า calculator |
| 6 | **Footer Banner** | Responsive (auto) | เหนือ Footer | ทุกหน้า |

**หลักการวาง:**
- ใช้ `<AdUnit slot="..." />` component เดียว reuse ทุกจุด
- Load แบบ `lazy` / `Intersection Observer` — โหลดเมื่อ scroll ถึงเท่านั้น
- ไม่วาดโฆษณาหน้า Home เกิน 2 จุด เพื่อ UX ที่ดี
- ไม่แสดง ad บนหน้า Admin และ Privacy/Terms

---

## 9. Analytics & Event Logging (หลังบ้าน)

### 9.1 สิ่งที่ต้องเก็บ

| Event | ข้อมูลที่เก็บ | ตาราง Supabase |
|-------|------------|---------------|
| Page view | `page`, `locale`, `referrer`, `user_agent`, `timestamp` | `page_views` |
| Calculator used | `calculator_slug`, `locale`, `timestamp` | `calculator_events` |
| Language change | `from_locale`, `to_locale`, `page`, `timestamp` | `ui_events` |
| Reset clicked | `calculator_slug`, `timestamp` | `ui_events` |
| 404 hit | `path`, `referrer`, `timestamp` | `error_logs` |

### 9.2 Supabase Schema

```sql
-- Page views
create table page_views (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  locale text,
  referrer text,
  user_agent text,
  created_at timestamptz default now()
);

-- Calculator usage
create table calculator_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text,
  created_at timestamptz default now()
);

-- UI events (language change, reset, etc.)
create table ui_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  payload jsonb,
  created_at timestamptz default now()
);

-- Error logs
create table error_logs (
  id uuid primary key default gen_random_uuid(),
  type text,          -- '404' | '500' | 'js_error'
  path text,
  message text,
  created_at timestamptz default now()
);
```

### 9.3 Admin Dashboard — สิ่งที่ดูได้

- **Top 10 Pages** — หน้าไหนมีคนเข้าเยอะสุดในช่วงเวลาที่เลือก
- **Top Calculators** — เครื่องคำนวณไหนถูกใช้เยอะสุด (กราฟแท่ง)
- **Calculator Usage Trend** — กราฟ line chart รายวัน/รายสัปดาห์
- **Language Distribution** — สัดส่วน TH vs EN
- **Traffic Source** — Referrer breakdown
- **Error Rate** — จำนวน 404 / 500 ต่อวัน
- กรองตาม **date range** ได้

> Admin dashboard ใช้ **Recharts** หรือ **shadcn/ui charts** + query ตรงจาก Supabase

### 9.4 การ Log (Client-side)

```
ทุก page load  →  fire /api/log/pageview  (Next.js API Route)
ทุก calculate  →  fire /api/log/calculator-event
```

- ใช้ `fetch` แบบ `keepalive: true` ไม่กระทบ performance
- ไม่เก็บ IP / PII ใด ๆ (PDPA compliant)

---

## 10. SEO

- แต่ละหน้ามี unique `<title>` + `<meta description>` ภาษาไทย (primary)
  - ตัวอย่าง: _"คำนวณ BMI ออนไลน์ฟรี | Smart Calculator"_
- `<link rel="alternate" hreflang="th|en">` ทุกหน้า
- Structured Data (JSON-LD): `SoftwareApplication` ทุกหน้า calculator
- `sitemap.xml` สร้างอัตโนมัติด้วย `next-sitemap`
- `robots.txt` — allow Googlebot ทุก path, block `/admin`
- Open Graph + Twitter Card Image (auto-generate ด้วย `@vercel/og`)
- Canonical URL ทุกหน้า
- Page speed ≥ 90 Lighthouse score (เพิ่มโอกาสติด rank)

---

## 11. Performance (เว็บต้องเบาและเร็ว)

- **Sidebar ไม่ทำให้ page reload** — Next.js nested `layout.tsx` รับประกัน
- Content area ใช้ `<Suspense>` + `loading.tsx` skeleton แทนการ flash หน้าว่าง
- Image: `next/image` ทุกรูป — lazy load + WebP อัตโนมัติ
- Font: `next/font` preload ตั้งแต่ HTML head
- Bundle: dynamic import สำหรับ component หนัก (chart, calculator ที่ซับซ้อน)
- Supabase log calls ใช้ `fetch` แบบ fire-and-forget ไม่บล็อก render
- Target: **LCP < 2s, CLS < 0.05, INP < 200ms**

---

## 12. Project Structure

```
smart_cal/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx               ← Root layout: Sidebar + Header + Footer
│   │   ├── page.tsx                 ← Home page
│   │   ├── not-found.tsx            ← Custom 404
│   │   ├── error.tsx                ← Error boundary (500)
│   │   ├── loading.tsx              ← Root skeleton
│   │   ├── maintenance/page.tsx
│   │   ├── about/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── announcements/
│   │   │   ├── page.tsx             ← บอร์ดประกาศ (list)
│   │   │   └── [id]/page.tsx        ← รายละเอียดประกาศ
│   │   ├── bmi/page.tsx
│   │   ├── unit-converter/page.tsx
│   │   ├── age-calculator/page.tsx
│   │   ├── currency-converter/page.tsx
│   │   ├── loan-calculator/page.tsx
│   │   ├── percentage-calculator/page.tsx
│   │   ├── calorie-calculator/page.tsx
│   │   ├── date-calculator/page.tsx
│   │   ├── sleep-calculator/page.tsx
│   │   └── gpa-calculator/page.tsx
│   ├── admin/
│   │   ├── layout.tsx               ← Admin layout (auth guard)
│   │   ├── page.tsx                 ← Dashboard overview
│   │   ├── analytics/page.tsx
│   │   └── announcements/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── api/
│       ├── log/
│       │   ├── pageview/route.ts    ← POST — บันทึก page view
│       │   └── event/route.ts       ← POST — บันทึก calculator event
│       └── og/route.tsx             ← GET — generate OG image
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ads/
│   │   └── AdUnit.tsx               ← Reusable AdSense component
│   ├── calculators/
│   │   ├── BmiCalculator.tsx
│   │   └── ...                      ← 1 file per calculator
│   ├── admin/
│   │   ├── StatsCard.tsx
│   │   └── UsageChart.tsx
│   └── ui/                          ← shadcn/ui components
├── config/
│   └── calculators.ts               ← Central config: slug, icon, name (th/en), component
├── hooks/
│   ├── useLocalStorage.ts
│   └── useAnalytics.ts              ← fire log events
├── lib/
│   ├── supabase.ts                  ← Supabase client
│   └── logger.ts                    ← Server-side log helpers
├── messages/
│   ├── th.json
│   └── en.json
├── public/
│   └── og/
├── next.config.ts
├── next-sitemap.config.js
└── package.json
```

---

## 13. End-to-End Deployment Guide

### Step 1 — พัฒนา & Test Local

```bash
npm run dev        # http://localhost:3000
npm run build      # ต้องไม่มี error ก่อน deploy
npm run lint
```

### Step 2 — ตั้งค่า Supabase

1. ไปที่ [supabase.com](https://supabase.com) → สร้าง project ฟรี
2. รัน SQL schema (section 9.2) ใน Supabase SQL Editor
3. คัดลอก `SUPABASE_URL` และ `SUPABASE_ANON_KEY` จาก Project Settings → API
4. สร้าง Admin user: Authentication → Users → Invite user

### Step 3 — ตั้งค่า Google AdSense

1. ไปที่ [adsense.google.com](https://adsense.google.com) → สมัครบัญชีใหม่
2. กรอก URL เว็บไซต์ (ต้องมี domain จริง ไม่ใช่ localhost)
3. วาง `<script>` AdSense tag ที่ได้รับใน `app/layout.tsx`
4. รอ Google review (ปกติ 1–2 สัปดาห์) — **เว็บต้องมี content จริง** ก่อนยื่น
5. เมื่อ approved → สร้าง Ad Units แต่ละตำแหน่ง → คัดลอก `data-ad-slot`
6. ใส่ slot ID ใน `AdUnit` component ตามตำแหน่ง (section 8)

> **เงื่อนไข AdSense approval:**  
> - เว็บต้องมี Privacy Policy page  
> - มี content เพียงพอ (ครบ 10 calculators)  
> - ไม่ใช่ under construction  
> - Domain ต้องเป็นชื่อจริง ไม่ใช่ subdomain ฟรี

### Step 4 — ซื้อ Domain

1. ซื้อ domain ที่ [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (ราคาถูก ไม่บวก markup) หรือ Namecheap
2. ตัวอย่างชื่อที่แนะนำ: `smartcal.in.th`, `calcthai.com`, `คำนวณ.com`
3. เปิด Cloudflare DNS หรือชี้ Nameserver ไป Vercel

### Step 5 — Deploy บน Vercel

1. Push code ขึ้น GitHub (สร้าง repo ใหม่)
2. ไปที่ [vercel.com](https://vercel.com) → New Project → Import GitHub repo
3. ตั้ง Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=eyJ...   ← Admin API routes เท่านั้น
ADMIN_EMAIL=your@email.com
```

4. Deploy → รอ build สำเร็จ
5. Vercel Dashboard → Settings → Domains → เพิ่ม domain ที่ซื้อไว้
6. ชี้ DNS ตาม instruction ของ Vercel (CNAME หรือ A record)
7. SSL ออกอัตโนมัติภายใน 1–2 นาที

### Step 6 — Google Search Console

1. ไปที่ [search.google.com/search-console](https://search.google.com/search-console)
2. Add Property → ใส่ domain
3. Verify ด้วย DNS TXT record (Vercel รองรับหรือ Cloudflare DNS)
4. Submit `sitemap.xml`: `https://yourdomain.com/sitemap.xml`
5. Request Indexing หน้า Home และหน้า calculator ทุกอัน

### Step 7 — Post-Launch Checklist

- [ ] `npm run build` ผ่านไม่มี error
- [ ] Lighthouse score ≥ 90 ทุก category
- [ ] ทดสอบ 10 calculators ครบทุกตัว
- [ ] ทดสอบ localStorage บน mobile (Chrome DevTools)
- [ ] ทดสอบ language switch TH ↔ EN
- [ ] ตรวจสอบ AdSense tag โหลดในหน้า production (DevTools → Network)
- [ ] ยืนยัน Supabase logs มีข้อมูลเข้ามา
- [ ] Google Search Console ยืนยัน domain แล้ว
- [ ] Submit sitemap.xml แล้ว
- [ ] ทดสอบ 404 page
- [ ] ทดสอบ Admin dashboard login

---

## 14. Development Phases

| Phase | งาน | Priority |
|-------|-----|---------|
| 1 | Setup Next.js 15 + Tailwind + shadcn/ui + next-intl + Supabase | Must |
| 2 | Layout: Sidebar + Header + Footer (nested layout ไม่ reload) | Must |
| 3 | Home page + 10 calculators + localStorage persistence | Must |
| 4 | Special pages: 404, error, loading, maintenance | Must |
| 5 | Announcements board (CRUD via Supabase) | Must |
| 6 | API Routes สำหรับ logging (pageview + calculator events) | Must |
| 7 | Admin dashboard + charts | Must |
| 8 | SEO: meta, sitemap, JSON-LD, OG images | Must |
| 9 | AdSense integration (6 ตำแหน่ง) | Must |
| 10 | Deploy Vercel + Domain + Search Console | Must |
| 11 | Sentry error monitoring + final audit | Should |
| 12 | Dark mode, PWA, additional calculators | Nice-to-have |

---

## 15. Non-Functional Requirements

| หัวข้อ | ข้อกำหนด |
|-------|---------|
| **Performance** | LCP < 2s, CLS < 0.05, INP < 200ms — Sidebar ไม่ทำให้ layout reload |
| **Accessibility** | WCAG 2.1 AA — keyboard nav, ARIA labels, color contrast ≥ 4.5:1 |
| **Security** | CSP header, Supabase RLS enabled, Admin routes auth-protected, ไม่ expose service key ใน client |
| **Privacy** | ไม่เก็บ IP/PII, PDPA compliant, มี cookie consent banner สำหรับ AdSense |
| **Scalability** | เพิ่ม calculator ใหม่ = แก้ `config/calculators.ts` + สร้าง 1 page file |
| **Reliability** | Sentry alert เมื่อ error rate สูง, Vercel auto-rollback หาก build fail |
