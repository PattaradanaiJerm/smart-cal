"use client";

import { AdUnit } from "./AdUnit";

/**
 * AdLayout — outer is flex-COL so top/bottom banners always span the full
 * main-column width (same as footer). Right sidebar is only in the middle row.
 *
 *  ┌──────── TOP BANNER (full main-column width, mx-auto centred) ────────┐
 *  ├────────────────────────────────┬──────── RIGHT SIDEBAR (xl+) ─────────┤
 *  │            {children}          │           (300×600) sticky           │
 *  ├────────────────────────────────┴──────────────────────────────────────┤
 *  └──────── BOTTOM BANNER (full main-column width, mx-auto centred) ──────┘
 *  └──────── FOOTER (full main-column width, max-w-5xl mx-auto) ───────────┘
 */
export function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      {/* TOP BANNER — full main-column width */}
      <div className="w-full px-6 pt-4 pb-3 border-b border-(--border)/50">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP_BANNER ?? "top-banner"}
          className="h-22.5 w-full max-w-3xl mx-auto"
          format="horizontal"
        />
      </div>

      {/* MIDDLE ROW — content + right sidebar */}
      <div className="flex items-start flex-1">
        {/* Page content */}
        <div className="flex-1 min-w-0 px-6 py-8 page-transition flex flex-col items-center">
          {children}
        </div>

        {/* Right sidebar — xl+ only, does NOT affect banner/footer width */}
        <div className="hidden xl:flex flex-col items-center w-72 shrink-0 border-l border-(--border)/50 px-4 py-6 sticky top-14 self-start">
          <AdUnit
            slot={process.env.NEXT_PUBLIC_AD_SLOT_RIGHT_SIDEBAR ?? "right-sidebar"}
            className="w-full h-150"
            format="rectangle"
          />
        </div>
      </div>

      {/* BOTTOM BANNER — full main-column width */}
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
