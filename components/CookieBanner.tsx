"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const tc = useTranslations("common");

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:pl-64">
      <div className="max-w-3xl mx-auto bg-(--card) border border-(--border) rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-2xl shrink-0">🍪</span>
        <p className="text-sm text-(--muted-foreground) flex-1">
          {tc("cookie_text")}{" "}
          <Link href="/privacy" className="text-indigo-600 hover:underline">
            {tc("privacy")}
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          {tc("accept")}
        </button>
      </div>
    </div>
  );
}
