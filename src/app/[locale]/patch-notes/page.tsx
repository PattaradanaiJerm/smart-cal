import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PolicyLayout, PolicySection } from "@/components/layout/PolicyLayout";
import { Tag, Zap, HardDrive, Rocket } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  await params;
  const t = await getTranslations("patch_notes");
  return {
    title: `${t("title")} | D-Calc`,
    description: t("subtitle"),
  };
}

const PATCHES = [
  {
    version: "1.2",
    date: { th: "พฤษภาคม 2026", en: "May 2026" },
    icon: <HardDrive size={16} />,
    color: "text-teal-500",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
    title: { th: "เพิ่มการแปลงความจุ", en: "Storage Converter" },
    changes: {
      th: [
        "✨ เพิ่มเครื่องมือ แปลงความจุข้อมูล (Storage Converter)",
        "🔢 รองรับ Bit, Byte, KB, MB, GB, TB, PB",
        "🔄 แปลงสองทิศทาง พร้อมตารางเทียบทุกหน่วยในครั้งเดียว",
        "🌐 อัปเกรดแปลงสกุลเงินเป็น Real-time ดึงอัตราจริงผ่าน frankfurter.app (อัปเดตทุก 1 ชั่วโมง)",
        "🐛 แก้ไข Hydration Error ใน CalculatorLayout (เพิ่ม mounted guard)",
        "🐛 แก้ไขปัญหา Hydration ใน useLocalStorage ทำให้ไม่มี error ตอนโหลดหน้า",
        "🎨 เพิ่มระยะห่างตัวอักษรทั่วโปรเจ็คให้อ่านง่ายขึ้น",
        "🗑️ ลบดอกโพดำออกจากหน้าจั่วไพ่",
      ],
      en: [
        "✨ New tool: Storage Converter (Bit, Byte, KB, MB, GB, TB, PB)",
        "🔄 Bidirectional conversion with full-unit comparison table",
        "🌐 Upgraded Currency Converter to real-time rates via frankfurter.app (updates every hour)",
        "🐛 Fixed Hydration Error in CalculatorLayout (added mounted guard)",
        "🐛 Fixed useLocalStorage hydration mismatch on page load",
        "🎨 Increased line-height across the project for better readability",
        "🗑️ Removed spade symbols from Card Draw results",
      ],
    },
  },
  {
    version: "1.1",
    date: { th: "มีนาคม 2026", en: "March 2026" },
    icon: <Zap size={16} />,
    color: "text-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    title: { th: "Optimize ความเสถียร", en: "Stability Optimizations" },
    changes: {
      th: [
        "⚡ ปรับปรุงประสิทธิภาพการโหลดหน้าทุกเครื่องมือ",
        "🔒 เพิ่ม Rate Limiting สำหรับ API ทั้งหมด",
        "📊 เพิ่มระบบ Log Analytics และบันทึก Calculator Events",
        "🌐 เพิ่มรองรับ 2 ภาษา (ไทย / อังกฤษ) ทั่วทั้งแอป",
        "🎯 เพิ่มหน้า Admin Dashboard สำหรับดู Analytics",
        "📢 เพิ่มระบบ Announcements",
        "🍪 เพิ่ม Cookie Consent Banner",
      ],
      en: [
        "⚡ Improved page load performance for all tools",
        "🔒 Added Rate Limiting to all API routes",
        "📊 Added Analytics logging and Calculator Event tracking",
        "🌐 Full bilingual support (Thai / English) across the app",
        "🎯 Added Admin Dashboard for Analytics",
        "📢 Added Announcements system",
        "🍪 Added Cookie Consent Banner",
      ],
    },
  },
  {
    version: "1.0",
    date: { th: "มกราคม 2026", en: "January 2026" },
    icon: <Rocket size={16} />,
    color: "text-indigo-500",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    title: { th: "เปิดตัวแอปครั้งแรก 🎉", en: "Initial Launch 🎉" },
    changes: {
      th: [
        "🚀 เปิดตัว D-Calc — รวมเครื่องคำนวณออนไลน์ฟรี",
        "🧮 เครื่องคำนวณ BMI, แคลอรี่, GPA, สินเชื่อ, เปอร์เซ็นต์",
        "📅 คำนวณอายุและคำนวณวันที่",
        "💤 คำนวณการนอน (Sleep Cycle)",
        "💱 แปลงสกุลเงิน และแปลงหน่วย",
        "🎲 สุ่มตัวเลข, วงล้อสุ่ม, สุ่มจั่วการ์ด",
        "🌓 รองรับ Dark Mode",
      ],
      en: [
        "🚀 Launched D-Calc — free online calculator hub",
        "🧮 BMI, Calorie, GPA, Loan, Percentage calculators",
        "📅 Age Calculator and Date Calculator",
        "💤 Sleep Cycle Calculator",
        "💱 Currency Converter and Unit Converter",
        "🎲 Random Number, Spin Wheel, Card Draw",
        "🌓 Dark Mode support",
      ],
    },
  },
];

export default async function PatchNotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isTh = locale === "th";
  const t = await getTranslations("patch_notes");

  return (
    <PolicyLayout
      title={t("title")}
      subtitle={t("subtitle")}
      lastUpdated={isTh ? "พฤษภาคม 2026" : "May 2026"}
    >
      {PATCHES.map((patch) => (
        <div key={patch.version} className="mb-6 rounded-xl border border-(--border) bg-(--card) overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-(--border) bg-(--muted)/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`${patch.color}`}>{patch.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${patch.badge}`}>
                    <Tag size={10} />
                    v{patch.version}
                  </span>
                  <span className="font-semibold text-sm">{isTh ? patch.title.th : patch.title.en}</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-(--muted-foreground) shrink-0">{isTh ? patch.date.th : patch.date.en}</span>
          </div>

          {/* Changes list */}
          <ul className="px-6 py-5 space-y-2.5">
            {(isTh ? patch.changes.th : patch.changes.en).map((change, i) => (
              <li key={i} className="text-sm text-(--muted-foreground) leading-relaxed">
                {change}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </PolicyLayout>
  );
}
