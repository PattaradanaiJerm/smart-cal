# คู่มือเพิ่มหน้า (Page) ใหม่ใน D-Calc

> ครอบคลุมทุกขั้นตอน: สร้างหน้า → เพิ่มการแปลภาษา → เชื่อม Sidebar/Footer → Push Git → Deploy

---

## ภาพรวมขั้นตอน

```
1. สร้าง Component  →  2. เพิ่ม Translation  →  3. เพิ่มใน Config  →  4. สร้าง Page File  →  5. Git & Deploy
```

---

## ขั้นที่ 1 — สร้าง Calculator Component

สร้างไฟล์ใน `components/calculators/` เช่น `MyCalculator.tsx`

```tsx
// components/calculators/MyCalculator.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function MyCalculator() {
  const t = useTranslations("my_calc"); // ชื่อ namespace ใน messages/*.json
  const [result, setResult] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t("title")}</h2>
      {/* ... UI ของ calculator ... */}
    </div>
  );
}
```

> ใช้ `useTranslations("namespace")` เสมอ — ห้าม hardcode ข้อความภาษาไทย/อังกฤษโดยตรง

---

## ขั้นที่ 2 — เพิ่ม Translation Keys

### 2.1 เพิ่มใน `messages/th.json`

```json
{
  "nav": {
    "my_calc": "ชื่อเครื่องคำนวณ (ไทย)"
  },
  "cards": {
    "my_calc": "คำอธิบายสั้น (ไทย)"
  },
  "my_calc": {
    "title": "ชื่อหน้า (ไทย)",
    "description": "คำอธิบาย SEO (ไทย)",
    "...": "คีย์อื่นๆ ที่ใช้ใน component"
  }
}
```

### 2.2 เพิ่มใน `messages/en.json` (เนื้อหาเดียวกัน แต่เป็นภาษาอังกฤษ)

```json
{
  "nav": {
    "my_calc": "My Calculator Name (EN)"
  },
  "cards": {
    "my_calc": "Short description (EN)"
  },
  "my_calc": {
    "title": "Page Title (EN)",
    "description": "SEO description (EN)",
    "...": "other keys..."
  }
}
```

> **สำคัญ**: ทั้งสองไฟล์ต้องมี keys ครบเหมือนกัน — ถ้าขาดจะ error ใน production

---

## ขั้นที่ 3 — เพิ่มใน Calculator Config

เปิด `config/calculators.ts` และเพิ่ม entry ใหม่:

```ts
import { MyIcon } from "lucide-react"; // เลือก icon จาก lucide-react

export const calculators: CalculatorConfig[] = [
  // ... existing calculators ...
  {
    slug: "my-calc",           // URL path: /my-calc
    icon: MyIcon,
    nameKey: "my_calc",        // key ใน messages/nav
    titleKey: "my_calc.title", // key ใน messages
    descKey: "my_calc.description",
    cardDescKey: "my_calc",    // key ใน messages/cards
    color: "bg-pink-500",      // tailwind bg color สำหรับ card icon
  },
];
```

> Sidebar, Footer, และ HomeContent จะดึง calculators จาก config นี้อัตโนมัติ — ไม่ต้องแก้ไขที่อื่น

---

## ขั้นที่ 4 — สร้าง Page File

สร้างโฟลเดอร์และไฟล์ใหม่ใน `src/app/[locale]/my-calc/page.tsx`  
(ชื่อโฟลเดอร์ต้องตรงกับ `slug` ใน config)

```tsx
// src/app/[locale]/my-calc/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MyCalculator } from "@/components/calculators/MyCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "my_calc" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/my-calc`,
      languages: { th: "/th/my-calc", en: "/en/my-calc" },
    },
  };
}

export default async function MyCalcPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "my_calc" });
  return (
    <CalculatorLayout title={t("title")} description={t("description")}>
      <MyCalculator />
    </CalculatorLayout>
  );
}
```

> `CalculatorLayout` จัดการ container, back button, related calculators อัตโนมัติ

---

## ขั้นที่ 5 — ตรวจสอบก่อน Push

```bash
# รัน dev server ตรวจความถูกต้อง
npm run dev

# เปิด browser เช็ค
# http://localhost:3000/my-calc       ← ภาษา default (ตาม cookie)
# สลับภาษาในหน้า → reload → เช็คการแปลภาษา

# TypeScript check (ไม่มี error)
npx tsc --noEmit
```

---

## ขั้นที่ 6 — Push ขึ้น Git

```bash
cd /Users/pattaradanai.jer/Desktop/smart_cal

# ดู diff ก่อน commit
git status
git diff --stat

# Stage ไฟล์ที่เปลี่ยน
git add .

# Commit พร้อม message ที่สื่อความหมาย
git commit -m "feat: add my-calc page with i18n"

# Push ขึ้น GitHub
git push origin main
```

### ตัวอย่าง commit message ที่ดี

| ประเภท | ตัวอย่าง |
|--------|----------|
| หน้าใหม่ | `feat: add bmi calculator page` |
| แก้ bug | `fix: bmi result wrong for female` |
| แปลภาษา | `i18n: add en/th translations for my-calc` |
| แก้ UI | `style: update footer bottom bar` |
| อัพ version | `chore: bump version to v1.3` |

---

## ขั้นที่ 7 — Deploy บน Vercel

Vercel จะ deploy อัตโนมัติเมื่อ push ไป `main` branch

```
git push origin main  →  Vercel Auto Deploy (ใช้เวลา ~1-2 นาที)
```

### ตรวจสอบ deploy status

1. เปิด [vercel.com/dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจ็ค → ดู **Deployments** tab
3. รอสถานะเป็น ✅ **Ready**
4. เปิด URL จริง แล้วเช็คหน้าใหม่

### กรณีมี Build Error

```bash
# เช็ค error ใน terminal ก่อน push
npm run build

# ถ้า error ให้แก้ให้หมดแล้วค่อย push
```

---

## Checklist สรุป

- [ ] สร้าง `components/calculators/MyCalculator.tsx` ใช้ `useTranslations`
- [ ] เพิ่ม keys ใน `messages/th.json` ครบ
- [ ] เพิ่ม keys ใน `messages/en.json` ครบ (ตรงกับ th.json)
- [ ] เพิ่ม entry ใน `config/calculators.ts`
- [ ] สร้าง `src/app/[locale]/my-calc/page.tsx`
- [ ] รัน `npm run dev` เช็คหน้าทำงานได้
- [ ] เช็คสลับภาษา EN ↔ TH ทำงานถูกต้อง
- [ ] รัน `npx tsc --noEmit` ไม่มี error
- [ ] `git add . && git commit -m "feat: ..." && git push`
- [ ] เช็ค Vercel deploy สำเร็จ

---

## โครงสร้างไฟล์ที่เกี่ยวข้อง

```
smart_cal/
├── components/
│   └── calculators/
│       └── MyCalculator.tsx          ← ① Component
├── config/
│   └── calculators.ts                ← ③ Config entry
├── messages/
│   ├── th.json                       ← ② Thai translations
│   └── en.json                       ← ② English translations
└── src/app/[locale]/
    └── my-calc/
        └── page.tsx                  ← ④ Page file
```
