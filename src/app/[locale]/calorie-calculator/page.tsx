import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CalorieCalculator } from "@/components/calculators/CalorieCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calorie" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/calorie-calculator`, languages: { th: "/th/calorie-calculator", en: "/en/calorie-calculator" } } };
}

export default async function CalorieCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calorie" });
  return <CalculatorLayout title={t("title")} description={t("description")}><CalorieCalculator /></CalculatorLayout>;
}
