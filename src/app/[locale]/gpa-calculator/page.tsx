import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { GpaCalculator } from "@/components/calculators/GpaCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gpa" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/gpa-calculator`, languages: { th: "/th/gpa-calculator", en: "/en/gpa-calculator" } } };
}

export default async function GpaCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gpa" });
  return <CalculatorLayout title={t("title")} description={t("description")}><GpaCalculator /></CalculatorLayout>;
}
