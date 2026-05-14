"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { FooterContent } from "@/components/layout/Footer";
import { AdLayout } from "@/components/ads/AdLayout";
import { AdUnit } from "@/components/ads/AdUnit";
import { CookieBanner } from "@/components/CookieBanner";
import { cn } from "@/lib/utils";

export default function LocaleClientLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
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
    <>
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

          {/* In-flow spacer that mirrors sidebar width — ensures main doesn't slip under fixed sidebar */}
          <div
            className={cn(
              "hidden lg:block shrink-0 transition-all duration-200",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
            aria-hidden
          />

          {/* Content area: main + right ad + footer, all after the sidebar spacer */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-1">
              {/* Main column */}
              <main className="flex-1 min-w-0 flex flex-col">
                <AdLayout>
                  {children}
                </AdLayout>
              </main>

              {/* Right sidebar ad */}
              <div className="hidden xl:flex shrink-0 w-72 border-l border-(--border)/50">
                <div className="sticky top-14 w-full px-4 py-6">
                  <AdUnit
                    slot={process.env.NEXT_PUBLIC_AD_SLOT_RIGHT_SIDEBAR ?? "right-sidebar"}
                    className="w-full h-150"
                    format="rectangle"
                  />
                </div>
              </div>
            </div>

            {/* Footer — spans full width after sidebar, including past right ad */}
            <footer className="border-t border-(--border)">
              <FooterContent />
            </footer>
          </div>
        </div>
      </div>
      <CookieBanner />
    </>
  );
}

