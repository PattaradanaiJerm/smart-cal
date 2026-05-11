import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bmi" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${locale}/bmi`, languages: { th: "/th/bmi", en: "/en/bmi" } },
  };
}

export default async function BmiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bmi" });
  return (
    <CalculatorLayout title={t("title")} description={t("description")}>
      <BmiCalculator />
    </CalculatorLayout>
  );
}
