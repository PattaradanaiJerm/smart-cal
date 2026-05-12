"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Calculator, RotateCw, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
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
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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

          {/* In-flow spacer that mirrors sidebar width — ensures main doesn't slip under fixed sidebar */}
          <div
            className={cn(
              "hidden lg:block shrink-0 transition-all duration-200",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
            aria-hidden
          />

          {/* Main area */}
          <main className="flex-1 min-w-0 flex flex-col pb-14 lg:pb-0">
            {/* Ad layout wraps ALL page content — ads are isolated here */}
            <AdLayout>
              {children}
            </AdLayout>

            <Footer />
          </main>
        </div>
      </div>
      <CookieBanner />

      {/* ── Mobile bottom nav (hidden on lg+) ── */}
      <nav className="mobile-bottom-nav lg:hidden" aria-label="Mobile navigation">
        <Link
          href={`/${locale}`}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] font-semibold transition-colors",
            pathname === `/${locale}` ? "text-blue-600 dark:text-blue-400" : "text-(--muted-foreground)"
          )}
        >
          <Home size={20} strokeWidth={pathname === `/${locale}` ? 2.5 : 1.8} />
          หน้าหลัก
        </Link>
        <Link
          href={`/${locale}/bmi`}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] font-semibold transition-colors",
            pathname.includes("/bmi") ? "text-blue-600 dark:text-blue-400" : "text-(--muted-foreground)"
          )}
        >
          <Calculator size={20} strokeWidth={pathname.includes("/bmi") ? 2.5 : 1.8} />
          BMI
        </Link>
        <Link
          href={`/${locale}/unit-converter`}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] font-semibold transition-colors",
            pathname.includes("/unit-converter") ? "text-blue-600 dark:text-blue-400" : "text-(--muted-foreground)"
          )}
        >
          <RotateCw size={20} strokeWidth={pathname.includes("/unit-converter") ? 2.5 : 1.8} />
          แปลงหน่วย
        </Link>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] font-semibold text-(--muted-foreground) transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
          {isDark ? "สว่าง" : "มืด"}
        </button>
      </nav>
    </NextIntlClientProvider>
  );
}

