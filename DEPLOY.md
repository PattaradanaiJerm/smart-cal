# 🚀 คู่มือ Deploy Smart Calculator

> ครบทุกขั้นตอน: จด Domain → Deploy → ขอ Google AdSense

---

## ภาพรวมขั้นตอน

```
1. จด Domain  →  2. Deploy บน Vercel  →  3. ผูก Domain  →  4. สมัคร AdSense  →  5. ใส่ Ad Code
```

---

## ขั้นที่ 1 — จด Domain

### แนะนำ: Cloudflare Registrar (ราคาถูกสุด ไม่มี markup)

1. ไปที่ **[cloudflare.com](https://cloudflare.com)** → สมัครบัญชีฟรี
2. ไปที่ **Domain Registration** → ค้นหาชื่อ domain ที่ต้องการ เช่น `smartcalc.app`
3. เลือก TLD:
   - `.app` — ~$15/ปี (เหมาะสมที่สุดสำหรับแอป)
   - `.com` — ~$10/ปี (ไว้วางใจได้มากที่สุด)
   - `.co.th` — ~$20/ปี (สำหรับตลาดไทยโดยเฉพาะ)
4. ชำระเงินและรอ ~5 นาที Domain จะ active ทันที

> **ทางเลือกอื่น:** Namecheap, Google Domains (ราคาคล้ายกัน)

---

## ขั้นที่ 2 — Deploy บน Vercel (แนะนำ — ฟรีสำหรับ hobby)

### 2.1 Push โค้ดขึ้น GitHub ก่อน

```bash
# ที่ terminal ในโฟลเดอร์โปรเจ็ค
cd /Users/pattaradanai.jer/Desktop/smart_cal

git init                          # ถ้ายังไม่ได้ init
git add .
git commit -m "initial deploy"
git remote add origin https://github.com/YOUR_USERNAME/smart-calculator.git
git push -u origin main
```

### 2.2 สร้างโปรเจ็คบน Vercel

1. ไปที่ **[vercel.com](https://vercel.com)** → Sign up ด้วย GitHub
2. คลิก **"Add New Project"**
3. เลือก repository `smart-calculator` → คลิก **"Import"**
4. Framework: เลือก **Next.js** (ตรวจจับอัตโนมัติ)
5. **อย่าแก้ Build Settings** — ปล่อยค่า default
6. เปิด **"Environment Variables"** แล้วใส่ค่าต่อไปนี้:

```
NEXT_PUBLIC_SITE_URL          = https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL      = https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY     = eyJhbGci...
NEXT_PUBLIC_ADSENSE_ID        = (เว้นว่างไว้ก่อน กรอกทีหลังเมื่อได้รับอนุมัติ)
NEXT_PUBLIC_AD_SLOT_TOP_BANNER      = (กรอกทีหลัง)
NEXT_PUBLIC_AD_SLOT_RIGHT_SIDEBAR   = (กรอกทีหลัง)
NEXT_PUBLIC_AD_SLOT_FOOTER          = (กรอกทีหลัง)
```

7. คลิก **"Deploy"** → รอ ~2 นาที
8. Vercel จะให้ URL ชั่วคราว เช่น `smart-calculator-abc.vercel.app`

---

## ขั้นที่ 3 — ผูก Domain เข้ากับ Vercel

### 3.1 เพิ่ม Domain ใน Vercel

1. ใน Vercel Project → ไปที่ **Settings → Domains**
2. พิมพ์ domain ของคุณ เช่น `smartcalc.app` → คลิก **"Add"**
3. Vercel จะแสดง DNS Record ที่ต้องตั้ง (ประมาณนี้):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3.2 ตั้งค่า DNS บน Cloudflare

1. ใน Cloudflare → เลือก Domain → คลิก **DNS → Records**
2. คลิก **"Add record"**:
   - ใส่ค่า A record และ CNAME ตามที่ Vercel บอก
   - **ปิด Proxy** (สัญลักษณ์เมฆ) ให้เป็น "DNS only" สีเทา
3. รอ DNS propagate ~5–30 นาที
4. กลับไป Vercel จะขึ้น ✅ เขียวเมื่อ domain active แล้ว

### 3.3 อัปเดต Environment Variable

กลับไปที่ Vercel → Settings → Environment Variables
แก้ `NEXT_PUBLIC_SITE_URL` เป็น domain จริง แล้ว **Redeploy**:

```
NEXT_PUBLIC_SITE_URL = https://smartcalc.app
```

> Vercel จะออก SSL Certificate (HTTPS) ให้อัตโนมัติฟรีผ่าน Let's Encrypt

---

## ขั้นที่ 4 — สมัคร Google AdSense

### 4.1 เงื่อนไขที่ต้องมีก่อนสมัคร

- [ ] เว็บต้องมี **domain ของตัวเอง** (ไม่ใช่ subdomain ฟรี)
- [ ] เว็บต้องออนไลน์และเข้าถึงได้จาก Google
- [ ] มีเนื้อหา **original** เพียงพอ (ไม่ใช่แค่หน้าว่าง)
- [ ] มีหน้า **Privacy Policy** ✅ (มีแล้ว `/privacy`)
- [ ] มีหน้า **Terms of Service** ✅ (มีแล้ว `/terms`)
- [ ] มีหน้า **Contact** ✅ (มีแล้ว `/contact`)
- [ ] มีอายุ **18 ปีขึ้นไป**
- [ ] มี **Google Account**

### 4.2 ขั้นตอนสมัคร

1. ไปที่ **[adsense.google.com](https://adsense.google.com)**
2. คลิก **"Get started"**
3. กรอก URL เว็บไซต์: `https://smartcalc.app`
4. เลือกประเทศ: **Thailand**
5. ยอมรับ Terms → คลิก **"Start using AdSense"**

### 4.3 ติดตั้ง AdSense Code เพื่อให้ Google Verify

Google จะให้ snippet ประมาณนี้:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

**วิธีใส่ใน โปรเจ็คนี้:**

แก้ `.env.local` (และใน Vercel Environment Variables):

```env
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

แค่นี้พอ — โค้ดในโปรเจ็คนี้ใส่ Script ไว้แล้วใน `src/app/layout.tsx` จะโหลด AdSense อัตโนมัติ

จากนั้น Redeploy บน Vercel แล้วกลับไปกด **"Done"** ใน AdSense

### 4.4 รอการตรวจสอบ

- Google ใช้เวลา **1–14 วัน** ตรวจสอบเว็บ
- ระหว่างรอ เว็บต้อง **online ตลอด** และมีปริมาณเนื้อหา
- Google จะส่ง Email แจ้งผลการอนุมัติ

> **เคล็ดลับเพิ่มโอกาสผ่าน:**
> - เว็บควรมี traffic จริงก่อนสมัคร (แม้แต่ไม่กี่คน)
> - เนื้อหาต้อง original ไม่ copy จากที่อื่น
> - ไม่มีโฆษณาจากแหล่งอื่นขณะรอ review

---

## ขั้นที่ 5 — ตั้งค่า Ad Units หลังได้รับอนุมัติ

### 5.1 สร้าง Ad Units ใน AdSense

1. ใน AdSense Dashboard → **Ads → By ad unit**
2. สร้าง Ad Unit สำหรับแต่ละตำแหน่ง:

| ชื่อ Ad Unit | ขนาด | ใช้สำหรับ |
|-------------|------|----------|
| `top-banner` | Leaderboard (728×90) | แถบบนสุด |
| `right-sidebar` | Large Rectangle (300×600) | คอลัมน์ขวา |
| `footer-banner` | Leaderboard (728×90) | แถบล่าง |

3. แต่ละ unit จะได้ **Ad Slot ID** เป็นตัวเลข เช่น `1234567890`

### 5.2 อัปเดต Environment Variables บน Vercel

```env
NEXT_PUBLIC_ADSENSE_ID              = ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_AD_SLOT_TOP_BANNER      = 1234567890
NEXT_PUBLIC_AD_SLOT_RIGHT_SIDEBAR   = 0987654321
NEXT_PUBLIC_AD_SLOT_FOOTER          = 1122334455
NEXT_PUBLIC_AD_SLOT_IN_CONTENT_TOP  = (ถ้าสร้างเพิ่ม)
NEXT_PUBLIC_AD_SLOT_BELOW_RESULT    = (ถ้าสร้างเพิ่ม)
```

### 5.3 Redeploy

```bash
# ถ้าแก้บน Vercel dashboard
# คลิก "Redeploy" ใน Vercel → Deployments

# ถ้าแก้โค้ด
git add .
git commit -m "add adsense slots"
git push  # Vercel deploy อัตโนมัติ
```

---

## ทางเลือก: Deploy ด้วย Docker (Self-hosted)

ถ้าต้องการ host บน VPS เอง (เช่น DigitalOcean, Linode, หรือ Server ส่วนตัว):

```bash
# 1. Copy โปรเจ็คไปยัง server
scp -r ./smart_cal user@your-server:/home/user/

# 2. สร้างไฟล์ .env บน server
cp .env.local .env
# แก้ค่าในไฟล์ .env ให้เป็นค่าจริง

# 3. Build และ run
docker compose up -d --build

# 4. ตรวจสอบ
docker compose ps
docker compose logs -f web
```

### ผูก Domain กับ Server (ถ้า self-host)

ใน Cloudflare DNS:
```
Type: A
Name: @
Value: IP_ADDRESS_ของ_SERVER
```

---

## Checklist ก่อน Go Live

```
[ ] NEXT_PUBLIC_SITE_URL ชี้ไปที่ domain จริง
[ ] Supabase URL + Key ถูกต้อง
[ ] Build ผ่าน (npm run build)
[ ] HTTPS ทำงาน (กด 🔒 ที่ browser)
[ ] sitemap.xml เข้าถึงได้ที่ /sitemap.xml
[ ] robots.txt เข้าถึงได้ที่ /robots.txt
[ ] หน้า /privacy, /terms, /contact เปิดได้
[ ] ส่ง sitemap ให้ Google Search Console
```

### ส่ง Sitemap ให้ Google

1. ไปที่ **[search.google.com/search-console](https://search.google.com/search-console)**
2. เพิ่ม Domain: `smartcalc.app`
3. Verify ด้วย DNS TXT record (Cloudflare ทำได้ใน 1 คลิก)
4. ไปที่ **Sitemaps** → ใส่ `https://smartcalc.app/sitemap.xml` → Submit
