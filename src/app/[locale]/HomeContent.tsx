"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { calculators } from "@/config/calculators";
import { CheckCircle, Zap, Lock, Globe, ChevronDown } from "lucide-react";
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

      {/* ─── Hero ─── */}
      <section className="relative text-center py-20 lg:py-28 px-4 overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 right-[8%] w-[480px] h-[380px] bg-blue-500/[0.08] dark:bg-blue-500/[0.09] rounded-full blur-[90px]" />
          <div className="absolute bottom-0 -left-10 w-[360px] h-[280px] bg-cyan-500/[0.07] dark:bg-cyan-400/[0.07] rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/90 dark:bg-white/[0.05] backdrop-blur-sm border border-blue-200/70 dark:border-blue-500/25 text-blue-700 dark:text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <Image src="/logo.png" alt="d-calc" width={16} height={16} className="rounded-sm opacity-90" />
            d-calc — {isTh ? "ฟรี ใช้ได้เลย" : "Free & Instant"}
          </div>

          {/* H1 */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-5 leading-[1.06] tracking-tight gradient-text">
            {t("hero_title")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-(--muted-foreground) max-w-lg mx-auto mb-10 leading-relaxed">
            {t("hero_subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/${locale}/bmi`} className="btn-primary gap-2 px-8 py-3.5 text-base w-full sm:w-auto">
              {t("hero_cta")} <span aria-hidden>→</span>
            </Link>
            <a href="#calculators" className="btn-secondary gap-2 px-7 py-3.5 text-base w-full sm:w-auto">
              {isTh ? "ดูทั้งหมด" : "Browse all"} <ChevronDown size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <section className="px-4 mb-12">
        <div
          className="bg-(--card) border border-(--border) rounded-2xl overflow-hidden flex divide-x divide-(--border)"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          {[
            { label: t("stats_tools"), value: `${calculators.length}+` },
            { label: isTh ? "การคำนวณ" : "Calculations", value: stats ? formatCount(stats.totalCalculations) : "—" },
            { label: isTh ? "ผู้เข้าชม" : "Page views", value: stats ? formatCount(stats.totalPageViews) : "—" },
          ].map((s) => (
            <div key={s.label} className="flex-1 px-4 py-5 sm:py-6 text-center">
              <p className="text-2xl sm:text-3xl font-black gradient-text leading-none mb-1.5">{s.value}</p>
              <p className="text-[11px] text-(--muted-foreground) font-semibold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Calculator grid ─── */}
      <section id="calculators" className="px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">{t("all_tools")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.slug}
                href={`/${locale}/${calc.slug}`}
                className="group flex items-center gap-4 bg-(--card) border border-(--border) rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                style={{ boxShadow: "var(--card-shadow)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow)")}
              >
                <span className={`flex items-center justify-center w-11 h-11 rounded-xl text-white shrink-0 ${calc.color}`}>
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {tn(calc.nameKey as Parameters<typeof tn>[0])}
                  </p>
                  <p className="text-xs text-(--muted-foreground) mt-0.5 line-clamp-1">
                    {isTh ? calc.descTh : calc.descEn}
                  </p>
                </div>
                <svg className="w-4 h-4 text-(--muted-foreground) shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Why D-Calc ─── */}
      <section className="px-4 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{isTh ? "ทำไมต้องใช้ D-Calc?" : "Why use D-Calc?"}</h2>
          <p className="text-sm text-(--muted-foreground)">
            {isTh ? "ออกแบบมาให้ใช้งานง่าย ถูกต้อง และเร็วที่สุด" : "Built for speed, accuracy, and simplicity."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="relative flex items-start gap-4 bg-(--card) border border-(--border) rounded-2xl p-5 overflow-hidden"
                style={{ boxShadow: "var(--card-shadow)" }}
              >
                {/* Background number accent */}
                <div className="absolute right-3 -top-1 text-7xl font-black text-(--border) select-none leading-none pointer-events-none" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <span className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shrink-0">
                  <Icon size={20} />
                </span>
                <div className="relative z-10">
                  <p className="font-bold mb-1">{f.title}</p>
                  <p className="text-sm text-(--muted-foreground) leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-4 pb-14">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isTh ? "คำถามที่พบบ่อย" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-2">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group bg-(--card) border border-(--border) rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 font-medium cursor-pointer list-none select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <span>{q}</span>
                <ChevronDown
                  size={16}
                  className="shrink-0 text-(--muted-foreground) transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5 border-t border-(--border)">
                <p className="text-sm text-(--muted-foreground) leading-relaxed pt-4">{a}</p>
              </div>
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

