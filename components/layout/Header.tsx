"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const switchLocale = (next: string) => {
    // Replace the locale prefix in the current path
    const newPath = pathname.replace(`/${locale}`, `/${next}`) || `/${next}`;
    router.push(newPath);
  };

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

      {/* Lang toggle */}
      <div className="flex items-center gap-1 bg-(--muted) rounded-xl p-1 border border-(--border)">
        <Globe size={13} className="text-(--muted-foreground) ml-1.5" />
        <LangButton active={locale === "th"} onClick={() => switchLocale("th")}>TH</LangButton>
        <LangButton active={locale === "en"} onClick={() => switchLocale("en")}>EN</LangButton>
      </div>
    </header>
  );
}

function LangButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-md text-xs font-semibold transition-colors",
        active
          ? "bg-white dark:bg-(--card) text-indigo-600 dark:text-indigo-400 shadow-sm"
          : "text-(--muted-foreground) hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
