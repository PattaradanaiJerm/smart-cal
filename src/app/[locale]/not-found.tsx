import Link from "next/link";
import { calculators } from "@/config/calculators";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-3 py-1 rounded-full mb-6">
        404 — Page not found
      </div>

      <div className="w-24 h-24 rounded-3xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-5xl mb-6">
        🔍
      </div>

      <h1 className="text-2xl font-bold mb-2">ไม่พบหน้าที่คุณต้องการ</h1>
      <p className="text-(--muted-foreground) text-sm mb-1">
        หน้าที่คุณกำลังหาอาจถูกย้าย ลบ หรือ URL ผิดพลาด
      </p>
      <p className="text-(--muted-foreground) text-sm mb-8">
        The page may have been moved, deleted, or the URL is incorrect.
      </p>

      <Link
        href="/th"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none mb-12"
      >
        กลับหน้าหลัก / Go home
      </Link>

      <div className="w-full max-w-lg">
        <p className="text-sm font-semibold text-(--muted-foreground) uppercase tracking-wider mb-4">
          เครื่องมือยอดนิยม / Popular tools
        </p>
        <div className="grid grid-cols-2 gap-3">
          {calculators.slice(0, 4).map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                href={`/th/${c.slug}`}
                className="flex items-center gap-3 bg-(--card) border border-(--border) rounded-xl p-3 hover:border-indigo-400 hover:shadow-sm transition-all text-sm text-left"
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-white shrink-0 ${c.color}`}>
                  <Icon size={15} />
                </span>
                <span className="font-medium">{c.descTh}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
