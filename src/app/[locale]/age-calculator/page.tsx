import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AgeCalculator } from "@/components/calculators/AgeCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "age" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/age-calculator`, languages: { th: "/th/age-calculator", en: "/en/age-calculator" } } };
}

export default async function AgeCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "age" });
  return <CalculatorLayout title={t("title")} description={t("description")}><AgeCalculator /></CalculatorLayout>;
}
