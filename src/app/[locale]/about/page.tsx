import type { Metadata } from "next";
import Link from "next/link";
import { calculators } from "@/config/calculators";

export const metadata: Metadata = {
  title: "About Us | Smart Calculator",
  description: "Learn about Smart Calculator — free online tools for BMI, loan, GPA, calorie, currency and more.",
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isTh = locale === "th";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Hero */}
      <div className="rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100 dark:border-indigo-900/40 p-8 mb-8 text-center">
        <div className="text-5xl mb-4">🧮</div>
        <h1 className="text-2xl font-bold mb-2">Smart Calculator</h1>
        <p className="text-(--muted-foreground) text-sm max-w-md mx-auto">
          {isTh
            ? "รวมเครื่องคำนวณออนไลน์ฟรี ใช้งานง่าย รองรับทุก device ไม่ต้องสมัครสมาชิก"
            : "Free online calculators — easy to use on any device, no sign-up required."}
        </p>
      </div>

      {/* Mission */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">{isTh ? "พันธกิจของเรา" : "Our Mission"}</h2>
        <p className="text-(--muted-foreground) leading-relaxed">
          {isTh
            ? "เราเชื่อว่าการคำนวณพื้นฐานในชีวิตประจำวัน เช่น BMI น้ำหนักตัว ดอกเบี้ยกู้ยืม GPA หรือแคลอรี่ ควรเข้าถึงได้ฟรีและง่ายดาย โดยไม่มีโฆษณาที่รบกวน และไม่ต้องสมัครสมาชิก"
            : "We believe everyday calculations — BMI, loans, GPA, calories — should be free, fast, and accessible to everyone without intrusive popups or account requirements."}
        </p>
      </section>

      {/* Tools */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">{isTh ? "เครื่องมือทั้งหมด" : "Our Tools"}</h2>
        <div className="grid grid-cols-2 gap-3">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.slug}
                href={`/${locale}/${calc.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-(--border) bg-(--card) hover:shadow-sm hover:-translate-y-0.5 transition-all group"
              >
                <span className={`p-2 rounded-lg bg-${calc.color}-100 dark:bg-${calc.color}-900/30 text-${calc.color}-600`}>
                  <Icon size={16} />
                </span>
                <span className="text-sm font-medium group-hover:text-indigo-600 transition-colors">
                  {isTh ? calc.nameKey : calc.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">{isTh ? "สิ่งที่เราให้ความสำคัญ" : "What We Stand For"}</h2>
        <div className="space-y-3">
          {[
            { icon: "🔓", title: isTh ? "เปิดให้ใช้ฟรี" : "Free & Open", desc: isTh ? "ทุกเครื่องมือใช้ได้ฟรีโดยไม่มีค่าใช้จ่าย" : "Every tool is free, forever. No paywalls." },
            { icon: "🔒", title: isTh ? "ความเป็นส่วนตัว" : "Privacy First", desc: isTh ? "ข้อมูลของคุณอยู่ในเครื่องของคุณ เราไม่เก็บ PII" : "Your data stays in your browser. We collect zero PII." },
            { icon: "⚡", title: isTh ? "รวดเร็ว ใช้งานง่าย" : "Fast & Simple", desc: isTh ? "ออกแบบสำหรับมือถือและ desktop รองรับทั้ง 2 ภาษา" : "Designed for mobile & desktop. Available in Thai & English." },
            { icon: "📊", title: isTh ? "ผลลัพธ์บันทึกอัตโนมัติ" : "Auto-Save", desc: isTh ? "ผลลัพธ์บันทึกไว้ในเบราว์เซอร์ — ปิดแล้วเปิดใหม่ยังอยู่" : "Results are saved locally — reopen and continue where you left off." },
          ].map((v) => (
            <div key={v.title} className="flex gap-4 p-4 rounded-xl bg-(--card) border border-(--border)">
              <span className="text-2xl shrink-0">{v.icon}</span>
              <div>
                <p className="font-semibold text-sm mb-0.5">{v.title}</p>
                <p className="text-xs text-(--muted-foreground)">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal links */}
      <div className="flex gap-4 text-sm text-(--muted-foreground)">
        <Link href={`/${locale}/privacy`} className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
        <Link href={`/${locale}/terms`} className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
      </div>
    </div>
  );
}

