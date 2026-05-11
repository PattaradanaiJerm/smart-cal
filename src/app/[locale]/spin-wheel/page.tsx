import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { SpinWheelGame } from "@/components/random/SpinWheelGame";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "spin_wheel" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/spin-wheel`,
      languages: { th: "/th/spin-wheel", en: "/en/spin-wheel" },
    },
  };
}

export default async function SpinWheelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "spin_wheel" });
  return (
    <CalculatorLayout title={t("title")} description={t("description")} color="pink">
      <SpinWheelGame />
    </CalculatorLayout>
  );
}
