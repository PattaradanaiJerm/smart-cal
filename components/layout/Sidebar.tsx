"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { calculators } from "@/config/calculators";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Home, Info, Mail, ChevronDown, ChevronsLeft, ChevronsRight,
  Calculator, ArrowLeftRight, Shuffle, Search, Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoryConfig: {
  id: string;
  labelKey: "calculators" | "converters" | "random";
  icon: LucideIcon;
  slugs: string[];
}[] = [
  {
    id: "calculators",
    labelKey: "calculators",
    icon: Calculator,
    slugs: ["bmi","age-calculator","loan-calculator","percentage-calculator","calorie-calculator","date-calculator","sleep-calculator","gpa-calculator"],
  },
  {
    id: "converters",
    labelKey: "converters",
    icon: ArrowLeftRight,
    slugs: ["unit-converter","currency-converter","storage-converter"],
  },
  {
    id: "random",
    labelKey: "random",
    icon: Shuffle,
    slugs: ["random-number","spin-wheel","card-draw"],
  },
];

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tcat = useTranslations("nav.categories");
  const pathname = usePathname();

  const isActive = (slug: string) => pathname.includes(`/${slug}`);

  const [search, setSearch] = useState("");

  const recentSlugs = useMemo(() => {
    try {
      return (JSON.parse(localStorage.getItem("sc_recent_calcs") ?? "[]") as string[]).slice(0, 3);
    } catch {
      return [];
    }
  // re-read whenever the user navigates (pathname changes trigger localStorage refresh)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const filteredCalcs = search.trim()
    ? calculators.filter((c) => {
        const term = search.toLowerCase();
        const name = t(c.nameKey as Parameters<typeof t>[0]).toLowerCase();
        return name.includes(term) || c.slug.includes(term);
      })
    : [];

  const recentCalcs = recentSlugs
    .map((slug) => calculators.find((c) => c.slug === slug))
    .filter(Boolean) as typeof calculators;

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categoryConfig.forEach((cat) => {
      if (cat.slugs.some((slug) => pathname.includes(`/${slug}`))) {
        initial[cat.id] = true;
      }
    });
    return initial;
  });

  const toggleCategory = (id: string) => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
    }
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <nav className="flex flex-col h-full overflow-y-auto">
      {/* Logo + collapse — hidden on mobile (Header already shows logo) */}
      <div className={cn("hidden lg:flex items-center h-14 pl-4 pr-2 border-b border-(--sidebar-border) shrink-0", collapsed && "lg:justify-center lg:pl-2 lg:pr-2")}>
        <Link
          href="/"
          onClick={onClose}
          className={cn("flex items-center gap-2 font-bold text-lg flex-1 min-w-0", collapsed && "lg:hidden")}
        >
          <Image src="/logo.png" alt="d-calc" width={28} height={28} className="shrink-0 rounded-md" />
          <span className="truncate gradient-text">d-calc</span>
        </Link>
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-(--muted) text-(--muted-foreground) transition-colors shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      {/* Home */}
      <div className="px-2 pt-3 pb-1">
        <NavLink
          href="/"
          active={pathname === "/" || pathname === ""}
          onClick={onClose}
          collapsed={collapsed}
          tooltip={tc("home")}
        >
          <Home size={16} className="shrink-0" />
          <span className={cn(collapsed && "lg:hidden")}>{tc("home")}</span>
        </NavLink>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--muted-foreground) pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tc("search_placeholder")}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-(--muted) border border-(--border) rounded-lg text-foreground placeholder:text-(--muted-foreground) focus:outline-none focus:border-(--primary) focus:bg-(--card) transition-colors"
            />
          </div>
        </div>
      )}

      {/* Search results */}
      {!collapsed && search.trim() && (
        <div className="px-2 pb-2">
          {filteredCalcs.length === 0 ? (
            <p className="text-xs text-(--muted-foreground) px-3 py-2">
              {tc("no_results")}
            </p>
          ) : (
            filteredCalcs.map((calc) => {
              const Icon = calc.icon;
              return (
                <NavLink
                  key={calc.slug}
                  href={`/${calc.slug}`}
                  active={isActive(calc.slug)}
                  onClick={() => { setSearch(""); onClose?.(); }}
                  collapsed={false}
                >
                  <span className={cn("flex items-center justify-center w-5 h-5 rounded text-white shrink-0", calc.color)}>
                    <Icon size={11} />
                  </span>
                  <span>{t(calc.nameKey as Parameters<typeof t>[0])}</span>
                </NavLink>
              );
            })
          )}
        </div>
      )}

      {/* Recently used */}
      {!collapsed && !search.trim() && recentCalcs.length > 0 && (
        <div className="px-2 pb-1">
          <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wider px-3 py-1.5 flex items-center gap-1.5">
            <Clock size={11} />
            {tc("recently_used")}
          </p>
          {recentCalcs.map((calc) => {
            const Icon = calc.icon;
            return (
              <NavLink key={calc.slug} href={`/${calc.slug}`} active={isActive(calc.slug)} onClick={onClose} collapsed={false}>
                <span className={cn("flex items-center justify-center w-5 h-5 rounded text-white shrink-0", calc.color)}>
                  <Icon size={11} />
                </span>
                <span>{t(calc.nameKey as Parameters<typeof t>[0])}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Section label */}
      <p className={cn("text-xs font-semibold text-(--muted-foreground) uppercase tracking-wider px-5 py-1.5", collapsed && "lg:hidden", search.trim() && "hidden")}>
        {tc("all_calculators")}
      </p>

      {/* Categories */}
      {!search.trim() && (
        <div className="px-2 pb-4 flex-1">
          {categoryConfig.map((cat) => {
          const CatIcon = cat.icon;
          const isOpen = openCategories[cat.id] ?? false;
          const hasActive = cat.slugs.some((slug) => isActive(slug));
          const label = tcat(cat.labelKey);

          return (
            <div key={cat.id}>
              <button
                onClick={() => toggleCategory(cat.id)}
                title={collapsed ? label : undefined}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-lg text-sm mb-0.5 px-3 py-2 transition-colors",
                  collapsed && "lg:w-10 lg:mx-auto lg:px-0 lg:py-2.5 lg:justify-center lg:gap-0",
                  hasActive
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-foreground hover:bg-(--muted)"
                )}
              >
                <span className={cn("flex items-center justify-center w-6 h-6 rounded-md text-white shrink-0", hasActive ? "bg-blue-500" : "bg-slate-400 dark:bg-slate-600")}>
                  <CatIcon size={13} />
                </span>
                <span className={cn("flex-1 text-left", collapsed && "lg:hidden")}>{label}</span>
                <ChevronDown
                  size={14}
                  className={cn("text-(--muted-foreground) transition-transform duration-200 shrink-0", isOpen && "rotate-180", collapsed && "lg:hidden")}
                />
              </button>

              {isOpen && (
                <div className={cn("ml-4 pl-3 border-l-2 border-(--sidebar-border) mb-1 space-y-0.5", collapsed && "lg:hidden")}>
                  {cat.slugs.map((slug) => {
                    const calc = calculators.find((c) => c.slug === slug);
                    if (!calc) return null;
                    const Icon = calc.icon;
                    return (
                      <NavLink key={slug} href={`/${slug}`} active={isActive(slug)} onClick={onClose} collapsed={false}>
                        <span className={cn("flex items-center justify-center w-5 h-5 rounded text-white shrink-0", calc.color)}>
                          <Icon size={11} />
                        </span>
                        <span>{t(calc.nameKey as Parameters<typeof t>[0])}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="px-2 py-3 border-t border-(--sidebar-border) space-y-0.5">
        <NavLink href="/about" active={isActive("about")} onClick={onClose} collapsed={collapsed} tooltip={tc("about")}>
          <Info size={16} className="shrink-0" />
          <span className={cn(collapsed && "lg:hidden")}>{tc("about")}</span>
        </NavLink>
        <NavLink href="/contact" active={isActive("contact")} onClick={onClose} collapsed={collapsed} tooltip={tc("contact")}>
          <Mail size={16} className="shrink-0" />
          <span className={cn(collapsed && "lg:hidden")}>{tc("contact")}</span>
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({
  href, active, children, onClick, collapsed = false, tooltip,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  collapsed?: boolean;
  tooltip?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? tooltip : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg text-sm transition-colors px-3 py-2",
        collapsed && "lg:w-10 lg:mx-auto lg:px-0 lg:py-2 lg:justify-center lg:gap-0",
        active
          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium"
          : "text-foreground hover:bg-(--muted)"
      )}
    >
      {children}
    </Link>
  );
}
