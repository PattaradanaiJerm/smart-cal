import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "loan" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/loan-calculator`, languages: { th: "/th/loan-calculator", en: "/en/loan-calculator" } } };
}

export default async function LoanCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "loan" });
  return <CalculatorLayout title={t("title")} description={t("description")}><LoanCalculator /></CalculatorLayout>;
}
