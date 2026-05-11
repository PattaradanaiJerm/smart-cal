import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { DateCalculator } from "@/components/calculators/DateCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "date" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/date-calculator`, languages: { th: "/th/date-calculator", en: "/en/date-calculator" } } };
}

export default async function DateCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "date" });
  return <CalculatorLayout title={t("title")} description={t("description")}><DateCalculator /></CalculatorLayout>;
}
