import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { HomeContent } from "./HomeContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  return {
    title: isTh
      ? "เครื่องคำนวณออนไลน์ฟรี | D-Calc"
      : "Free Online Calculators | D-Calc",
    description: isTh
      ? "รวมเครื่องคำนวณออนไลน์ฟรี คำนวณ BMI อายุ สินเชื่อ GPA แคลอรี่ แปลงหน่วย แปลงสกุลเงิน และอื่นๆ ใช้งานง่าย ฟรี รองรับทุก device"
      : "Free online calculators — BMI, Age, Loan, GPA, Calorie, Unit converter, Currency and more. Easy to use on any device, no sign-up required.",
    keywords: isTh
      ? ["เครื่องคำนวณ", "BMI", "คำนวณอายุ", "สินเชื่อ", "GPA", "แคลอรี่", "แปลงหน่วย", "ฟรี"]
      : ["calculator", "BMI", "age calculator", "loan calculator", "GPA", "calorie", "unit converter", "free"],
    openGraph: {
      title: isTh ? "เครื่องคำนวณออนไลน์ฟรี | D-Calc" : "Free Online Calculators | D-Calc",
      description: isTh
        ? "รวมเครื่องคำนวณออนไลน์ฟรีกว่า 10 ประเภท ใช้งานง่ายบนทุก device"
        : "10+ free online calculators. Easy to use on any device.",
    },
  };
}

export default function HomePage() {
  return <HomeContent />;
}
