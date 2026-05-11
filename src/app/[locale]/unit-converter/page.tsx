import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { UnitConverter } from "@/components/calculators/UnitConverter";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "unit" });
  return { title: t("title"), description: t("description"), alternates: { canonical: `/${locale}/unit-converter`, languages: { th: "/th/unit-converter", en: "/en/unit-converter" } } };
}

export default async function UnitConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "unit" });
  return <CalculatorLayout title={t("title")} description={t("description")}><UnitConverter /></CalculatorLayout>;
}
