import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { StorageConverter } from "@/components/calculators/StorageConverter";
import { CalculatorLayout } from "@/components/calculators/CalculatorLayout";
import { HardDrive } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "storage" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/storage-converter`,
      languages: { th: "/th/storage-converter", en: "/en/storage-converter" },
    },
  };
}

export default async function StorageConverterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "storage" });
  return (
    <CalculatorLayout
      title={t("title")}
      description={t("description")}
      icon={<HardDrive size={28} className="text-white" />}
      color="teal"
      slug="storage-converter"
    >
      <StorageConverter />
    </CalculatorLayout>
  );
}
