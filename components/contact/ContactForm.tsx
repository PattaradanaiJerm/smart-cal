"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Send } from "lucide-react";
import Swal from "sweetalert2";

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact");

  const topics = [
    { icon: "🐛", title: t("topic_bug_title"),     desc: t("topic_bug_desc") },
    { icon: "💡", title: t("topic_feature_title"), desc: t("topic_feature_desc") },
    { icon: "🤝", title: t("topic_partner_title"), desc: t("topic_partner_desc") },
    { icon: "🔒", title: t("topic_privacy_title"), desc: t("topic_privacy_desc") },
  ];

  const [topic, setTopic] = useState(topics[0]?.title ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || message.trim().length < 5) {
      Swal.fire({
        icon: "warning",
        title: t("alert_msg_required_title"),
        text: t("alert_msg_required_text"),
        confirmButtonText: t("alert_ok"),
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    // Confirmation dialog
    const result = await Swal.fire({
      icon: "question",
      title: t("alert_confirm_title"),
      html: `<div class="text-left text-sm space-y-1"><p><strong>${t("alert_topic_label")}</strong> ${topic}</p><p><strong>${t("alert_message_label_html")}</strong> ${message.trim()}</p></div>`,
      showCancelButton: true,
      confirmButtonText: t("alert_send_btn"),
      cancelButtonText: t("alert_cancel_btn"),
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, message: message.trim(), locale }),
      });

      const data = await res.json();

      if (data.ok) {
        Swal.fire({
          icon: "success",
          title: t("alert_success_title"),
          text: t("alert_success_text"),
          confirmButtonText: t("alert_ok"),
          confirmButtonColor: "#4f46e5",
        });
        setMessage("");
        setTopic(topics[0]?.title ?? "");
      } else if (data.error === "rate_limited") {
        Swal.fire({
          icon: "warning",
          title: t("alert_rate_title"),
          text: t("alert_rate_text"),
          confirmButtonText: t("alert_ok"),
          confirmButtonColor: "#4f46e5",
        });
      } else {
        throw new Error("server_error");
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: t("alert_error_title"),
        text: t("alert_error_text"),
        confirmButtonText: t("alert_retry"),
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-(--border) bg-(--muted)/50">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <MessageCircle size={14} />
          {t("send_message_heading")}
        </h2>
      </div>
      <div className="px-6 py-5 space-y-5 text-sm">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-(--muted-foreground)">
            {t("subject_label")}
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {topics.map((tp) => (
              <option key={tp.title} value={tp.title}>
                {tp.icon} {tp.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-(--muted-foreground)">
            {t("message_label")}
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("message_placeholder")}
            className="w-full px-3 py-2 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Send size={14} />
          {loading ? t("sending") : t("send_btn")}
        </button>
      </div>
    </div>
  );
}
