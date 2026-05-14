"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { calculators } from "@/config/calculators";
import { CheckCircle, Zap, Lock, Globe, ChevronDown } from "lucide-react";
import { useSiteStats } from "@/hooks/useSiteStats";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { CountUp } from "@/components/ui/CountUp";
import { FadeInUp } from "@/components/ui/FadeInUp";

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
  const tc = useTranslations("cards");
  const locale = useLocale();
  const stats = useSiteStats();

  const features = [
    { icon: Zap,         title: t("feature_instant_title"),   desc: t("feature_instant_desc") },
    { icon: CheckCircle, title: t("feature_accurate_title"),  desc: t("feature_accurate_desc") },
    { icon: Lock,        title: t("feature_privacy_title"),   desc: t("feature_privacy_desc") },
    { icon: Globe,       title: t("feature_bilingual_title"), desc: t("feature_bilingual_desc") },
  ];

  const faqs = [
    { q: t("faq_free_q"),   a: t("faq_free_a") },
    { q: t("faq_bmi_q"),    a: t("faq_bmi_a") },
    { q: t("faq_data_q"),   a: t("faq_data_a") },
    { q: t("faq_loan_q"),   a: t("faq_loan_a") },
    { q: t("faq_mobile_q"), a: t("faq_mobile_a") },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "D-Calc",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dcalcs.com",
    description: t("website_description"),
    inLanguage: locale,
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative text-center py-20 lg:py-28 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
        {/* Canvas floating particles */}
        <FloatingParticles />

        {/* Aurora animated background */}
        <div className="aurora-wrap" aria-hidden>
          <div className="aurora-blob aurora-1" />
          <div className="aurora-blob aurora-2" />
          <div className="aurora-blob aurora-3" />
        </div>

        {/* Shimmer sweep */}
        <div className="hero-shimmer absolute inset-0" aria-hidden />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Live badge */}
          <FadeInUp delay={0}>
            <div className="inline-flex items-center gap-2.5 glass-badge text-blue-700 dark:text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <Image src="/logo.png" alt="d-calc" width={16} height={16} className="rounded-sm opacity-90" />
              d-calc — {t("badge_free")}
            </div>
          </FadeInUp>

          <FadeInUp delay={80}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-5 leading-[1.06] tracking-tight gradient-text">
              {t("hero_title")}
            </h1>
          </FadeInUp>

          <FadeInUp delay={160}>
            <p className="text-lg sm:text-xl text-(--muted-foreground) max-w-lg mx-auto mb-10 leading-relaxed">
              {t("hero_subtitle")}
            </p>
          </FadeInUp>

          <FadeInUp delay={240}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/bmi" className="btn-primary gap-2 px-8 py-3.5 text-base w-full sm:w-auto">
                {t("hero_cta")} <span aria-hidden>→</span>
              </Link>
              <a href="#calculators" className="btn-secondary gap-2 px-7 py-3.5 text-base w-full sm:w-auto">
                {t("browse_all")} <ChevronDown size={15} />
              </a>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ══════════════════════ STATS (live from DB) ══════════════════════ */}
      <FadeInUp className="px-4 mt-16 mb-16">
        <div
          className="bg-(--card) border border-(--border) rounded-2xl overflow-hidden flex divide-x divide-(--border)"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          {[
            { label: t("stats_tools"),        raw: calculators.length,              suffix: "+" },
            { label: t("stats_calc"),          raw: stats?.totalCalculations ?? 0,   fmt: formatCount },
            { label: t("stats_page_views"),    raw: stats?.totalPageViews ?? 0,      fmt: formatCount },
          ].map((s) => (
            <div key={s.label} className="flex-1 px-4 py-5 sm:py-6 text-center">
              <p className="text-2xl sm:text-3xl font-black gradient-text leading-none mb-1.5">
                {s.raw > 0
                  ? <><CountUp end={s.raw} format={s.fmt} />{s.suffix ?? ""}</>
                  : <span className="opacity-30 animate-pulse">—</span>}
              </p>
              <p className="text-[11px] text-(--muted-foreground) font-semibold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </FadeInUp>

      {/* ══════════════════════ CALCULATOR GRID ══════════════════════ */}
      <section id="calculators" className="px-4 pb-12">
        <FadeInUp>
          <h2 className="text-2xl font-bold mb-6 mt-10">{t("all_tools")}</h2>
        </FadeInUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {calculators.map((calc, i) => {
            const Icon = calc.icon;
            return (
              <FadeInUp key={calc.slug} delay={Math.min(i * 35, 280)}>
                <Link
                  href={`/${calc.slug}`}
                  className="card-glow group flex items-center gap-4 bg-(--card) border border-(--border) rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 w-full"
                  style={{ boxShadow: "var(--card-shadow)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow)")}
                >
                  <span className={`flex items-center justify-center w-11 h-11 rounded-xl text-white shrink-0 transition-transform duration-300 group-hover:scale-110 ${calc.color}`}>
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {tn(calc.nameKey as Parameters<typeof tn>[0])}
                    </p>
                    <p className="text-xs text-(--muted-foreground) mt-0.5 line-clamp-1">
                      {tc(calc.cardDescKey as Parameters<typeof tc>[0])}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-(--muted-foreground) shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </FadeInUp>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════ WHY D-CALC ══════════════════════ */}
      <section className="px-4 pb-12">
        <FadeInUp className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{t("why_title")}</h2>
          <p className="text-sm text-(--muted-foreground)">
            {t("why_subtitle")}
          </p>
        </FadeInUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeInUp key={f.title} delay={i * 80}>
                <div
                  className="relative flex items-start gap-4 bg-(--card) border border-(--border) rounded-2xl p-5 overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200 h-full"
                  style={{ boxShadow: "var(--card-shadow)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--card-shadow)")}
                >
                  <div className="absolute right-2 -top-1 text-8xl font-black text-(--border) select-none leading-none pointer-events-none opacity-60" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={20} />
                  </span>
                  <div className="relative z-10">
                    <p className="font-bold mb-1">{f.title}</p>
                    <p className="text-sm text-(--muted-foreground) leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </FadeInUp>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section className="px-4 pb-14">
        <FadeInUp>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("faq_title")}
          </h2>
        </FadeInUp>
        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => (
            <FadeInUp key={q} delay={i * 50}>
              <details className="group bg-(--card) border border-(--border) rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-5 py-4 font-medium cursor-pointer list-none select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <span>{q}</span>
                  <ChevronDown size={16} className="shrink-0 text-(--muted-foreground) transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 border-t border-(--border)">
                  <p className="text-sm text-(--muted-foreground) leading-relaxed pt-4">{a}</p>
                </div>
              </details>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
