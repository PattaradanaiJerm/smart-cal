import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SleepCalculator } from "@/components/calculators/SleepCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sleep" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/sleep-calculator`, languages: { th: "/th/sleep-calculator", en: "/en/sleep-calculator" } } };
}

export default async function SleepCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sleep" });
  return <CalculatorLayout title={t("title")} description={t("description")}><SleepCalculator /></CalculatorLayout>;
}
