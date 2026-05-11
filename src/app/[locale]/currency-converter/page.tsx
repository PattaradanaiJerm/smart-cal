import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CurrencyConverter } from "@/components/calculators/CurrencyConverter";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "currency" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/currency-converter`, languages: { th: "/th/currency-converter", en: "/en/currency-converter" } } };
}

export default async function CurrencyConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "currency" });
  return <CalculatorLayout title={t("title")} description={t("description")}><CurrencyConverter /></CalculatorLayout>;
}
