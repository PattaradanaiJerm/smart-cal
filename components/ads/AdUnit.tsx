"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  slot: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  fullWidthResponsive?: boolean;
}

export function AdUnit({ slot, className, format = "auto", fullWidthResponsive = true }: AdUnitProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!publisherId || pushedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      // @ts-expect-error adsbygoogle not typed
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // ignore
    }
  }, [publisherId]);

  if (!publisherId) {
    // Dev placeholder — styled to look like a real ad slot
    const isVertical = format === "vertical";
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-(--border) bg-(--muted)/60",
          className
        )}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,.02)_10px,rgba(0,0,0,.02)_20px)]" />
        <span className="relative z-10 text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)/60">
          {isVertical ? "Ad" : "Advertisement"}
        </span>
        {!isVertical && (
          <span className="relative z-10 text-[10px] text-(--muted-foreground)/40">
            {slot}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
