import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { RandomNumberGenerator } from "@/components/random/RandomNumberGenerator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "random_number" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/random-number`,
      languages: { th: "/th/random-number", en: "/en/random-number" },
    },
  };
}

export default async function RandomNumberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "random_number" });
  return (
    <CalculatorLayout title={t("title")} description={t("description")} color="indigo">
      <RandomNumberGenerator />
    </CalculatorLayout>
  );
}
