"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { calculators } from "@/config/calculators";
import { PatchNotesModal } from "./PatchNotesModal";

export function FooterContent() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tp = useTranslations("patch_notes");
  const [patchOpen, setPatchOpen] = useState(false);

  return (
    <>
    <div className="px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-3">
              <Image src="/logo.png" alt="d-calc" width={32} height={32} className="rounded-md" />
              <span className="gradient-text">d-calc</span>
            </Link>
            <p className="text-sm text-(--muted-foreground) leading-relaxed max-w-xs">
              {tc("footer_brand")}
            </p>
            <div className="flex gap-3 mt-4">
              <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">🇹🇭 ภาษาไทย</span>
              <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">🇺🇸 English</span>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <p className="font-semibold text-sm mb-4">{tc("all_calculators")}</p>
            <ul className="space-y-2">
              {calculators.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-sm text-(--muted-foreground) hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {t(c.nameKey as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-sm mb-4">{tc("info")}</p>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-(--muted-foreground) hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {tc("about")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-(--muted-foreground) hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {tc("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-(--muted-foreground) hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {tc("terms")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-(--muted-foreground) hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {tc("contact")}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setPatchOpen(true)}
                  className="text-sm text-(--muted-foreground) hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  {tp("title")}
                </button>
              </li>
              {/* Announcements — hidden until ready */}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-(--border) flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-(--muted-foreground)">
          <p>© {new Date().getFullYear()} D-Calc. All rights reserved.</p>
          <button
            onClick={() => setPatchOpen(true)}
            className="text-sm font-medium text-(--muted-foreground) hover:text-blue-600 transition-colors"
            title="Patch Notes"
          >
            v1.2 ↗
          </button>
        </div>
      </div>

      <PatchNotesModal open={patchOpen} onClose={() => setPatchOpen(false)} />
    </>
  );
}
