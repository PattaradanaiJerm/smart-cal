"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdLayout } from "@/components/ads/AdLayout";
import { CookieBanner } from "@/components/CookieBanner";
import { NextIntlClientProvider } from "next-intl";
import { cn } from "@/lib/utils";

export default function LocaleClientLayout({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: Record<string, unknown>;
  locale: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Track pageviews on every navigation
  useEffect(() => {
    fetch("/api/log/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        locale,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, locale]);

  // Persist collapse state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved === "true") setSidebarCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setSidebarCollapsed((v) => {
      localStorage.setItem("sidebar_collapsed", String(!v));
      return !v;
    });
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <div className="flex flex-1 relative">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar — fixed on desktop, drawer on mobile */}
          <aside
            className={cn(
              "fixed top-14 left-0 bottom-0 z-30 bg-(--sidebar-bg) border-r border-(--sidebar-border) overflow-y-auto transition-all duration-200",
              "w-64",
              sidebarCollapsed ? "lg:w-16" : "lg:w-64",
              "lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
          >
            <Sidebar
              onClose={() => setSidebarOpen(false)}
              collapsed={sidebarCollapsed}
              onToggleCollapse={toggleCollapse}
            />
          </aside>

          {/* Main area — right of sidebar */}
          <main className={cn("flex-1 min-w-0 flex flex-col transition-all duration-200", sidebarCollapsed ? "lg:ml-16" : "lg:ml-64")}>
            {/* Ad layout wraps ALL page content — ads are isolated here */}
            <AdLayout>
              {children}
            </AdLayout>

            <Footer />
          </main>
        </div>
      </div>
      <CookieBanner />
    </NextIntlClientProvider>
  );
}

