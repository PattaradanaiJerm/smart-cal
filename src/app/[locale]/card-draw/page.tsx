import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { CardDrawGame } from "@/components/random/CardDrawGame";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "card_draw" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/card-draw`,
      languages: { th: "/th/card-draw", en: "/en/card-draw" },
    },
  };
}

export default async function CardDrawPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "card_draw" });
  return (
    <CalculatorLayout title={t("title")} description={t("description")} color="orange">
      <CardDrawGame />
    </CalculatorLayout>
  );
}
