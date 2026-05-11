"use client";

import { useCallback } from "react";

export function useAnalytics() {
  const logPageView = useCallback((page: string, locale: string, referrer?: string) => {
    fetch("/api/log/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, locale, referrer }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  const logCalculatorEvent = useCallback((slug: string, locale: string) => {
    fetch("/api/log/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, locale }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  const logUIEvent = useCallback((eventName: string, payload?: Record<string, unknown>) => {
    fetch("/api/log/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ui", eventName, payload }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return { logPageView, logCalculatorEvent, logUIEvent };
}
