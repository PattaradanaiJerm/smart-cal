import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PolicyLayout } from "@/components/layout/PolicyLayout";
import { ContactForm } from "@/components/contact/ContactForm";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | D-Calc",
  description: "Contact D-Calc — ติดต่อเรา สำหรับคำถาม ข้อเสนอแนะ หรือรายงานปัญหา",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("contact");

  const topics = [
    { icon: "🐛", title: t("topic_bug_title"),     desc: t("topic_bug_desc") },
    { icon: "💡", title: t("topic_feature_title"), desc: t("topic_feature_desc") },
    { icon: "🤝", title: t("topic_partner_title"), desc: t("topic_partner_desc") },
    { icon: "🔒", title: t("topic_privacy_title"), desc: t("topic_privacy_desc") },
  ];

  return (
    <PolicyLayout
      title={t("page_title")}
      subtitle={t("page_subtitle")}
      lastUpdated={locale === "th" ? "พฤษภาคม 2026" : "May 2026"}
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

      {/* Contact form — saves to DB */}
      <ContactForm locale={locale} />

      {/* Privacy note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-sm text-indigo-700 dark:text-indigo-300">
        <Shield size={16} className="mt-0.5 shrink-0" />
        <p>{t("privacy_note")}</p>
      </div>
    </PolicyLayout>
  );
}
