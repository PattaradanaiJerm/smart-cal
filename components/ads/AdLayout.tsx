"use client";

import { AdUnit } from "./AdUnit";

/**
 * AdLayout — wraps page content with ad slots.
 *
 *  ┌──── TOP BANNER (inside content col) ────┐  ┌── RIGHT SIDEBAR ──┐
 *  │      {children}                         │  │   (300×600)       │
 *  │                                         │  │   sticky          │
 *  └──── BOTTOM BANNER (inside content col) ─┘  └───────────────────┘
 *
 * Top & bottom banners are scoped to the content column so they always
 * centre-align with the calculator cards, regardless of whether the
 * right-sidebar is visible.
 */
export function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-0 items-start min-h-0">
      {/* ── CONTENT COLUMN — carries banners + page content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOP BANNER */}
        <div className="w-full px-4 pt-4 pb-3 border-b border-(--border)/50">
          <AdUnit
            slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP_BANNER ?? "top-banner"}
            className="h-22.5 w-full max-w-3xl mx-auto"
            format="horizontal"
          />
        </div>

        {/* Page content */}
        <div className="flex-1 min-w-0 px-4 py-8 page-transition flex flex-col items-center">
          {children}
        </div>

        {/* BOTTOM BANNER */}
        <div className="w-full px-4 pt-3 pb-4 border-t border-(--border)/50">
          <AdUnit
            slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER ?? "footer-banner"}
            className="h-22.5 w-full max-w-3xl mx-auto"
            format="horizontal"
          />
        </div>
      </div>

      {/* ── RIGHT SIDEBAR — desktop only (xl+) ── */}
      <div className="hidden xl:flex flex-col items-center w-76 shrink-0 border-l border-(--border)/50 px-4 py-6 sticky top-14 self-start">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_RIGHT_SIDEBAR ?? "right-sidebar"}
          className="w-full h-150"
          format="rectangle"
        />
      </div>
    </div>
  );
}
