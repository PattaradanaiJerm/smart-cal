"use client";

import { AdUnit } from "./AdUnit";

/**
 * AdLayout — wraps page content with ad slots.
 * Completely separate from page/calculator layout logic.
 *
 *  ┌──────────────── TOP BANNER (728×90) ────────────────┐
 *  ├───────────────────────────┬─────── RIGHT SIDEBAR ────┤
 *  │      {children}           │        (300×600)         │
 *  │                           │        sticky            │
 *  ├───────────────────────────┴──────────────────────────┤
 *  └──────────────── BOTTOM BANNER (728×90) ─────────────-┘
 */
export function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      {/* ── TOP BANNER ── */}
      <div className="w-full px-4 pt-4 pb-3 border-b border-(--border)/50">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP_BANNER ?? "top-banner"}
          className="h-22.5 w-full max-w-182 mx-auto"
          format="horizontal"
        />
      </div>

      {/* ── CONTENT + RIGHT SIDEBAR ── */}
      <div className="flex gap-0 items-start">
        {/* Page content */}
        <div className="flex-1 min-w-0 px-4 py-8 page-transition flex flex-col items-center">
          {children}
        </div>

        {/* Right sidebar ad — desktop only */}
        <div className="hidden xl:flex flex-col items-center w-80 shrink-0 border-l border-(--border)/50 px-4 py-6 sticky top-14 self-start">
          <AdUnit
            slot={process.env.NEXT_PUBLIC_AD_SLOT_RIGHT_SIDEBAR ?? "right-sidebar"}
            className="w-75 h-150"
            format="rectangle"
          />
        </div>
      </div>

      {/* ── BOTTOM BANNER ── */}
      <div className="w-full px-4 pt-3 pb-4 border-t border-(--border)/50">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER ?? "footer-banner"}
          className="h-22.5 w-full max-w-182 mx-auto"
          format="horizontal"
        />
      </div>
    </div>
  );
}
