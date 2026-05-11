"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Dices } from "lucide-react";

export function RandomNumberGenerator() {
  const locale = useLocale();
  const isTh = locale === "th";

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sort, setSort] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [animKey, setAnimKey] = useState(0);

  const generate = () => {
    setError("");

    if (min >= max) {
      setError(isTh ? "ค่าน้อยสุดต้องน้อยกว่าค่ามากสุด" : "Min must be less than Max");
      return;
    }

    const range = max - min + 1;

    if (!allowDuplicates && count > range) {
      setError(
        isTh
          ? `จำนวนตัวเลขเกินช่วงที่เป็นไปได้ (${range} ตัว)`
          : `Count exceeds available range (${range} values)`
      );
      return;
    }

    const nums: number[] = [];

    if (allowDuplicates) {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * range) + min);
      }
    } else {
      // Fisher-Yates on a subset
      const pool = Array.from({ length: range }, (_, i) => i + min);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      nums.push(...pool.slice(0, count));
    }

    if (sort) nums.sort((a, b) => a - b);

    setResults(nums);
    setAnimKey((k) => k + 1);
  };

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {isTh ? "ตัวเลขน้อยสุด" : "Minimum"}
            </label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-full border border-(--border) rounded-lg px-3 py-2 bg-background text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {isTh ? "ตัวเลขมากสุด" : "Maximum"}
            </label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full border border-(--border) rounded-lg px-3 py-2 bg-background text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {isTh ? "จำนวนตัวเลขที่ต้องการ" : "How many numbers"}
          </label>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="w-full border border-(--border) rounded-lg px-3 py-2 bg-background text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            {isTh ? "อนุญาตตัวซ้ำ" : "Allow duplicates"}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sort}
              onChange={(e) => setSort(e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            {isTh ? "เรียงลำดับ" : "Sort ascending"}
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        <button
          onClick={generate}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          <Dices size={18} />
          {isTh ? "สุ่มเลข!" : "Generate!"}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div
          key={animKey}
          className="bg-(--card) border border-(--border) rounded-2xl p-6 animate-in fade-in duration-300"
        >
          <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wider mb-3">
            {isTh ? "ผลลัพธ์" : "Results"} ({results.length})
          </p>
          {results.length === 1 ? (
            <p className="text-6xl font-bold text-center text-indigo-600 dark:text-indigo-400 py-4">
              {results[0]}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {results.map((n, i) => (
                <span
                  key={i}
                  className={cn(
                    "inline-flex items-center justify-center min-w-12 px-3 py-1.5 rounded-xl font-bold text-sm",
                    "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  )}
                >
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
