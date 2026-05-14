"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { Menu, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
}

const LANGUAGES = [
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function Header({ onMenuToggle }: HeaderProps) {
  const locale = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (next: string) => {
    localStorage.setItem("preferred_locale", next);
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    window.location.reload();
    setLangOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 h-14 bg-(--sidebar-bg)/90 backdrop-blur-md border-b border-(--sidebar-border) flex items-center px-4 gap-3">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-(--muted) transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Logo (mobile only) */}
      <span className="lg:hidden inline-flex items-center gap-2 font-bold text-base">
        <Image src="/logo.png" alt="d-calc" width={26} height={26} className="rounded-lg" />
        <span className="gradient-text font-extrabold">d-calc</span>
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Dark mode toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-(--muted) transition-colors text-(--muted-foreground) hover:text-foreground"
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      )}

      {/* Language dropdown */}
      <div className="relative" ref={langRef}>
        <button
          onClick={() => setLangOpen((o) => !o)}
          className="flex items-center gap-1.5 bg-(--muted) hover:bg-(--border) border border-(--border) rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors"
          aria-label="Select language"
        >
          <Globe size={13} className="text-(--muted-foreground)" />
          <span>{current.flag}</span>
          <span>{current.label}</span>
          <svg
            className={cn("w-3 h-3 text-(--muted-foreground) transition-transform duration-150", langOpen && "rotate-180")}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {langOpen && (
          <div className="absolute right-0 mt-1.5 w-40 bg-(--card) border border-(--border) rounded-xl shadow-lg overflow-hidden z-50">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors text-left",
                  locale === lang.code
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    : "hover:bg-(--muted) text-foreground"
                )}
              >
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.label}</span>
                {locale === lang.code && (
                  <svg className="w-3 h-3 ml-auto text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
