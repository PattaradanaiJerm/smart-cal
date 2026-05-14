import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { calculators } from "@/config/calculators";

export const metadata: Metadata = {
  title: "About Us | D-Calc",
  description: "Learn about D-Calc — free online tools for BMI, loan, GPA, calorie, currency and more.",
};

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tn = await getTranslations("nav");

  const values = [
    { icon: "🔓", titleKey: "value_free_title",     descKey: "value_free_desc" },
    { icon: "🔒", titleKey: "value_privacy_title",  descKey: "value_privacy_desc" },
    { icon: "⚡", titleKey: "value_fast_title",     descKey: "value_fast_desc" },
    { icon: "📊", titleKey: "value_autosave_title", descKey: "value_autosave_desc" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Hero */}
      <div className="rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100 dark:border-indigo-900/40 p-8 mb-8 text-center">
        <div className="mb-4 flex justify-center"><Image src="/logo.png" alt="d-calc" width={80} height={80} className="rounded-2xl" /></div>
        <h1 className="text-2xl font-bold mb-2">D-Calc</h1>
        <p className="text-(--muted-foreground) text-sm max-w-md mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Mission */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">{t("mission")}</h2>
        <p className="text-(--muted-foreground) leading-relaxed">
          {t("mission_long")}
        </p>
      </section>

      {/* Tools */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">{t("tools_heading")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.slug}
                href={`/${calc.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-(--border) bg-(--card) hover:shadow-sm hover:-translate-y-0.5 transition-all group"
              >
                <span className={`p-2 rounded-lg bg-${calc.color}-100 dark:bg-${calc.color}-900/30 text-${calc.color}-600`}>
                  <Icon size={16} />
                </span>
                <span className="text-sm font-medium group-hover:text-indigo-600 transition-colors">
                  {tn(calc.nameKey as Parameters<typeof tn>[0])}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">{t("values_heading")}</h2>
        <div className="space-y-3">
          {values.map((v) => (
            <div key={v.titleKey} className="flex gap-4 p-4 rounded-xl bg-(--card) border border-(--border)">
              <span className="text-2xl shrink-0">{v.icon}</span>
              <div>
                <p className="font-semibold text-sm mb-0.5">{t(v.titleKey as Parameters<typeof t>[0])}</p>
                <p className="text-xs text-(--muted-foreground)">{t(v.descKey as Parameters<typeof t>[0])}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal links */}
      <div className="flex gap-4 text-sm text-(--muted-foreground)">
        <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
      </div>
    </div>
  );
}

