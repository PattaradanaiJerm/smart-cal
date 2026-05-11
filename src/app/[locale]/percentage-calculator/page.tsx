import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "percentage" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/percentage-calculator`, languages: { th: "/th/percentage-calculator", en: "/en/percentage-calculator" } } };
}

export default async function PercentageCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "percentage" });
  return <CalculatorLayout title={t("title")} description={t("description")}><PercentageCalculator /></CalculatorLayout>;
}
