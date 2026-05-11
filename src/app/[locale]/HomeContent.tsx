"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { calculators } from "@/config/calculators";
import { CheckCircle, Zap, Lock, Globe } from "lucide-react";
import { useSiteStats } from "@/hooks/useSiteStats";

/** Format large numbers nicely: 1234 → "1.2K", 12345 → "12K", 0 → "0" */
function formatCount(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.floor(n / 1_000)}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function HomeContent() {
  const t = useTranslations("home");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const isTh = locale === "th";
  const stats = useSiteStats();

  const features = isTh
    ? [
        { icon: Zap, title: "ใช้งานได้ทันที", desc: "ไม่ต้องสมัครสมาชิก ไม่ต้องดาวน์โหลด เปิดเว็บแล้วใช้เลย" },
        { icon: CheckCircle, title: "ผลลัพธ์แม่นยำ", desc: "สูตรคำนวณมาตรฐานสากล ทดสอบและตรวจสอบโดยผู้เชี่ยวชาญ" },
        { icon: Lock, title: "ความเป็นส่วนตัว", desc: "ข้อมูลทั้งหมดประมวลผลในเบราว์เซอร์ของคุณ ไม่ส่งข้อมูลไปเซิร์ฟเวอร์" },
        { icon: Globe, title: "รองรับสองภาษา", desc: "ใช้งานได้ทั้งภาษาไทยและภาษาอังกฤษ สลับภาษาได้ทุกเมื่อ" },
      ]
    : [
        { icon: Zap, title: "Instant Access", desc: "No signup, no download. Open the site and start calculating." },
        { icon: CheckCircle, title: "Accurate Results", desc: "Industry-standard formulas, tested and verified." },
        { icon: Lock, title: "Privacy First", desc: "All calculations run in your browser — no data sent to servers." },
        { icon: Globe, title: "Bilingual", desc: "Available in Thai and English. Switch anytime." },
      ];

  const faqs = isTh
    ? [
        { q: "เว็บนี้ใช้งานฟรีไหม?", a: "ฟรี 100% ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น ไม่ต้องสมัครสมาชิก" },
        { q: "คำนวณ BMI คืออะไร?", a: "BMI (Body Mass Index) คือดัชนีมวลกาย คำนวณจากน้ำหนัก (กก.) หารด้วยส่วนสูง (เมตร) ยกกำลัง 2 ใช้บ่งชี้น้ำหนักเกินหรือน้อยกว่าเกณฑ์" },
        { q: "ข้อมูลที่กรอกจะถูกเก็บไหม?", a: "ไม่ ข้อมูลทั้งหมดคำนวณในเบราว์เซอร์ของคุณเท่านั้น ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ใดๆ" },
        { q: "เครื่องคำนวณสินเชื่อคำนวณยังไง?", a: "ใช้สูตรการผ่อนชำระมาตรฐาน (Amortization) โดยคำนวณจากจำนวนเงินกู้ อัตราดอกเบี้ยต่อปี และระยะเวลาผ่อน" },
        { q: "รองรับบนมือถือไหม?", a: "รองรับทุก device ทั้ง PC, tablet และมือถือ ออกแบบแบบ responsive" },
      ]
    : [
        { q: "Is this website free to use?", a: "Yes, 100% free. No subscription, no signup required." },
        { q: "What is BMI?", a: "BMI (Body Mass Index) is calculated by dividing your weight in kg by your height in meters squared. It indicates whether your weight is in a healthy range." },
        { q: "Is my data stored anywhere?", a: "No. All calculations happen entirely in your browser. No data is sent to any server." },
        { q: "How does the loan calculator work?", a: "It uses the standard amortization formula based on loan amount, annual interest rate, and repayment period to calculate monthly payments." },
        { q: "Does it work on mobile?", a: "Yes, fully responsive — works on PC, tablet, and mobile." },
      ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "D-Calc",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://d-calc.vercel.app",
    description: isTh ? "รวมเครื่องคำนวณออนไลน์ฟรีกว่า 10 ประเภท" : "10+ free online calculators",
    inLanguage: isTh ? "th" : "en",
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <section className="text-center py-12 px-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
          <Image src="/logo.png" alt="d-calc" width={20} height={20} className="rounded-sm" />
          d-calc
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          {t("hero_title")}
        </h1>
        <p className="text-lg text-(--muted-foreground) max-w-2xl mx-auto mb-8">
          {t("hero_subtitle")}
        </p>
        <Link
          href={`/${locale}/bmi`}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          {t("hero_cta")} →
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 mb-10 px-4">
        {[
          { label: t("stats_tools"), value: `${calculators.length}+` },
          { label: isTh ? "การคำนวณ" : "Calculations", value: stats ? formatCount(stats.totalCalculations) : "…" },
          { label: isTh ? "ผู้เข้าชม" : "Page views", value: stats ? formatCount(stats.totalPageViews) : "…" },
        ].map((s) => (
          <div key={s.label} className="bg-(--card) rounded-xl border border-(--border) p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{s.value}</p>
            <p className="text-sm text-(--muted-foreground) mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Calculator grid */}
      <section className="px-4 pb-10">
        <h2 className="text-xl font-bold mb-6">{t("all_tools")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.slug}
                href={`/${locale}/${calc.slug}`}
                className="group flex items-start gap-4 bg-(--card) hover:shadow-md border border-(--border) rounded-xl p-5 transition-all hover:-translate-y-0.5"
              >
                <span className={`flex items-center justify-center w-10 h-10 rounded-xl text-white shrink-0 ${calc.color}`}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tn(calc.nameKey as Parameters<typeof tn>[0])}
                  </p>
                  <p className="text-sm text-(--muted-foreground) mt-0.5 line-clamp-2">
                    {isTh ? calc.descTh : calc.descEn}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why use D-Calc */}
      <section className="px-4 pb-12">
        <h2 className="text-xl font-bold mb-6 text-center">
          {isTh ? "ทำไมต้องใช้ D-Calc?" : "Why use D-Calc?"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex items-start gap-4 bg-(--card) border border-(--border) rounded-xl p-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm text-(--muted-foreground) mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-12">
        <h2 className="text-xl font-bold mb-6">
          {isTh ? "คำถามที่พบบ่อย" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="bg-(--card) border border-(--border) rounded-xl px-5 py-4 group">
              <summary className="font-medium cursor-pointer list-none flex items-center justify-between gap-2">
                <span>{q}</span>
                <span className="text-(--muted-foreground) shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-sm text-(--muted-foreground) mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
