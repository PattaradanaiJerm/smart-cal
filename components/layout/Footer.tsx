import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { calculators } from "@/config/calculators";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const isTh = locale === "th";

  return (
    <footer className="mt-auto border-t border-(--border)">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-3">
              <span>🧮</span> Smart Calc
            </Link>
            <p className="text-sm text-(--muted-foreground) leading-relaxed max-w-xs">
              {isTh
                ? "รวมเครื่องคำนวณออนไลน์ฟรี ใช้งานง่าย รองรับทุก device ไม่ต้องสมัครสมาชิก"
                : "Free online calculators — easy to use on any device, no sign-up required."}
            </p>
            <div className="flex gap-3 mt-4">
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">🇹🇭 ภาษาไทย</span>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full">🇺🇸 English</span>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <p className="font-semibold text-sm mb-4">{tc("all_calculators")}</p>
            <ul className="space-y-2">
              {calculators.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${locale}/${c.slug}`}
                    className="text-sm text-(--muted-foreground) hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {t(c.nameKey as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-sm mb-4">{isTh ? "ข้อมูล" : "Info"}</p>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-(--muted-foreground) hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {tc("about")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-sm text-(--muted-foreground) hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {tc("privacy")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-sm text-(--muted-foreground) hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {tc("terms")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-sm text-(--muted-foreground) hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {tc("contact")}
                </Link>
              </li>
              {/* Announcements — hidden until ready */}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-(--border) flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-(--muted-foreground)">
          <p>© {new Date().getFullYear()} Smart Calculator. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/privacy`} className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href={`/${locale}/terms`} className="hover:text-indigo-600 transition-colors">Terms</Link>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {isTh ? "ฟรี 100%" : "100% Free"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
