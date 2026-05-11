import type { Metadata } from "next";
import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { Mail, Globe, Shield, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Smart Calculator",
  description: "Contact Smart Calculator — ติดต่อเรา สำหรับคำถาม ข้อเสนอแนะ หรือรายงานปัญหา",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTh = locale === "th";

  const topics = isTh
    ? [
        { icon: "🐛", title: "รายงานปัญหา", desc: "พบข้อผิดพลาดในการคำนวณ หรือปัญหาการแสดงผล" },
        { icon: "💡", title: "ข้อเสนอแนะ", desc: "มีไอเดียเครื่องมือใหม่ หรืออยากปรับปรุงส่วนที่มีอยู่" },
        { icon: "🤝", title: "ความร่วมมือ", desc: "สนใจร่วมมือกัน ลิงก์แลกเปลี่ยน หรืองานพาร์ทเนอร์" },
        { icon: "🔒", title: "ความเป็นส่วนตัว", desc: "คำถามเกี่ยวกับนโยบายความเป็นส่วนตัวหรือข้อมูลของคุณ" },
      ]
    : [
        { icon: "🐛", title: "Bug Report", desc: "Found an error in calculations or display issues" },
        { icon: "💡", title: "Feature Request", desc: "Have ideas for new tools or improvements to existing ones" },
        { icon: "🤝", title: "Partnership", desc: "Interested in collaboration, link exchange, or partnership" },
        { icon: "🔒", title: "Privacy Inquiry", desc: "Questions about our privacy policy or your data" },
      ];

  return (
    <PolicyLayout
      title={isTh ? "ติดต่อเรา" : "Contact Us"}
      subtitle={isTh ? "เรายินดีรับฟังคุณเสมอ" : "We'd love to hear from you"}
      lastUpdated={isTh ? "พฤษภาคม 2026" : "May 2026"}
    >
      {/* Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className="flex items-start gap-3 p-4 rounded-xl border border-(--border) bg-(--card)"
          >
            <span className="text-2xl mt-0.5">{topic.icon}</span>
            <div>
              <p className="font-semibold text-sm">{topic.title}</p>
              <p className="text-xs text-(--muted-foreground) mt-0.5">{topic.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact info */}
      <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-(--border) bg-(--muted)/50">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Mail size={14} />
            {isTh ? "ช่องทางติดต่อ" : "How to Reach Us"}
          </h2>
        </div>
        <div className="px-6 py-5 space-y-4 text-sm text-(--muted-foreground)">
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 text-indigo-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-0.5">{isTh ? "อีเมล" : "Email"}</p>
              <p>
                {isTh
                  ? "ติดต่อได้ที่อีเมลที่ระบุในการจดทะเบียนโดเมน (WHOIS) หรือส่งผ่านฟอร์มด้านล่าง"
                  : "Contact us via the email listed in our domain registration (WHOIS) or use the form below"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe size={16} className="mt-0.5 text-indigo-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-0.5">{isTh ? "เว็บไซต์" : "Website"}</p>
              <p>smartcalc.app</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle size={16} className="mt-0.5 text-indigo-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground mb-0.5">
                {isTh ? "เวลาตอบกลับ" : "Response Time"}
              </p>
              <p>{isTh ? "ภายใน 1-3 วันทำการ" : "Within 1-3 business days"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick contact form (static — mailto) */}
      <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-(--border) bg-(--muted)/50">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <MessageCircle size={14} />
            {isTh ? "ส่งข้อความ" : "Send a Message"}
          </h2>
        </div>
        <div className="px-6 py-5 space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-(--muted-foreground)">
              {isTh ? "หัวข้อ" : "Subject"}
            </label>
            <select className="w-full px-3 py-2 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {topics.map((t) => (
                <option key={t.title}>{t.icon} {t.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-(--muted-foreground)">
              {isTh ? "ข้อความ" : "Message"}
            </label>
            <textarea
              rows={4}
              placeholder={isTh ? "พิมพ์ข้อความของคุณที่นี่..." : "Type your message here..."}
              className="w-full px-3 py-2 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <a
            href="mailto:contact@smartcalc.app"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Mail size={14} />
            {isTh ? "ส่งอีเมล" : "Send via Email"}
          </a>
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-sm text-indigo-700 dark:text-indigo-300">
        <Shield size={16} className="mt-0.5 shrink-0" />
        <p>
          {isTh
            ? "ข้อมูลที่คุณส่งมาจะถูกใช้เพื่อตอบคำถามของคุณเท่านั้น เราไม่แชร์ข้อมูลส่วนบุคคลของคุณกับบุคคลที่สาม"
            : "Information you send will only be used to respond to your inquiry. We do not share your personal information with third parties."}
        </p>
      </div>
    </PolicyLayout>
  );
}
