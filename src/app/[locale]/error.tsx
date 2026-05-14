"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  const tc = useTranslations("common");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-medium px-3 py-1 rounded-full mb-6">
        500 — {t("500_title")}
      </div>

      <div className="w-24 h-24 rounded-3xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-5xl mb-6">
        ⚠️
      </div>

      <h1 className="text-2xl font-bold mb-2">{t("500_title")}</h1>
      <p className="text-(--muted-foreground) text-sm max-w-sm mb-8">{t("500_desc")}</p>

      {error.digest && (
        <p className="text-xs text-(--muted-foreground) mb-6 font-mono bg-(--muted) px-3 py-1 rounded">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          {tc("try_again")}
        </button>
        <Link
          href="/"
          className="bg-(--muted) hover:bg-(--border) text-foreground font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {tc("home")}
        </Link>
      </div>
    </div>
  );
}
