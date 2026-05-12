"use client";

import { AdUnit } from "./AdUnit";

/**
 * AdLayout — wraps page content with ad slots.
 *
 *  ┌──────────── TOP BANNER (full main-column width) ─────────────┐
 *  ├──────────────────────────────┬──────── RIGHT SIDEBAR ─────────┤
 *  │      {children}              │        (300×600) sticky        │
 *  ├──────────────────────────────┴────────────────────────────────┤
 *  └──────────── BOTTOM BANNER (full main-column width) ───────────┘
 *
 * Top & bottom banners span the FULL main-column width (content + right
 * sidebar area) so they align with the footer below.
 */
export function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      {/* ── TOP BANNER — full main-column width ── */}
      <div className="w-full px-6 pt-4 pb-3 border-b border-(--border)/50">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP_BANNER ?? "top-banner"}
          className="h-22.5 w-full max-w-3xl mx-auto"
          format="horizontal"
        />
      </div>

      {/* ── CONTENT ROW: page + right sidebar ── */}
      <div className="flex gap-0 items-start flex-1">
        {/* Page content */}
        <div className="flex-1 min-w-0 px-6 py-8 page-transition flex flex-col items-center">
          {children}
        </div>

        {/* Right sidebar ad — desktop xl+ only */}
        <div className="hidden xl:flex flex-col items-center w-72 shrink-0 border-l border-(--border)/50 px-4 py-6 sticky top-14 self-start">
          <AdUnit
            slot={process.env.NEXT_PUBLIC_AD_SLOT_RIGHT_SIDEBAR ?? "right-sidebar"}
            className="w-full h-150"
            format="rectangle"
          />
        </div>
      </div>

      {/* ── BOTTOM BANNER — full main-column width ── */}
      <div className="w-full px-6 pt-3 pb-4 border-t border-(--border)/50">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER ?? "footer-banner"}
          className="h-22.5 w-full max-w-3xl mx-auto"
          format="horizontal"
        />
      </div>
    </div>
  );
}
