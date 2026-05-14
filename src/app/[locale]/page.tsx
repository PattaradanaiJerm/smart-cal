import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HomeContent } from "./HomeContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("home");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    keywords: locale === "th"
      ? ["เครื่องคำนวณ", "BMI", "คำนวณอายุ", "สินเชื่อ", "GPA", "แคลอรี่", "แปลงหน่วย", "ฟรี"]
      : ["calculator", "BMI", "age calculator", "loan calculator", "GPA", "calorie", "unit converter", "free"],
    openGraph: {
      title: t("meta_og_title"),
      description: t("meta_og_description"),
    },
  };
}

export default function HomePage() {
  return <HomeContent />;
}
