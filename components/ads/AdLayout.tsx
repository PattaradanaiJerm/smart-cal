"use client";

import { AdUnit } from "./AdUnit";

/**
 * AdLayout — simple flex-col: top-banner → content → bottom-banner.
 * Right sidebar is handled at the LocaleClientLayout level as a sibling of
 * <main>, so it never affects the width calculations here.
 *
 *  ┌───── TOP BANNER — w-full of main column ─────┐
 *  │              {children}                       │
 *  └───── BOTTOM BANNER — w-full of main column ──┘
 */
export function AdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      {/* TOP BANNER */}
      <div className="w-full px-6 pt-4 pb-3 border-b border-(--border)/50">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP_BANNER ?? "top-banner"}
          className="h-22.5 w-full"
          format="horizontal"
        />
      </div>

      {/* Page content */}
      <div className="flex-1 min-w-0 px-6 py-8 page-transition flex flex-col items-center">
        {children}
      </div>

      {/* BOTTOM BANNER */}
      <div className="w-full px-6 pt-3 pb-4 border-t border-(--border)/50">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER ?? "footer-banner"}
          className="h-22.5 w-full"
          format="horizontal"
        />
      </div>
    </div>
  );
}
