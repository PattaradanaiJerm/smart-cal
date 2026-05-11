"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Layers, Shuffle } from "lucide-react";

const COLORS = [
  "from-indigo-500 to-violet-500",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-fuchsia-500 to-purple-500",
  "from-lime-500 to-green-500",
  "from-red-500 to-orange-500",
];

const DEFAULT_ITEMS_TH = [
  "ผู้เล่น 1","ผู้เล่น 2","ผู้เล่น 3","ผู้เล่น 4","ผู้เล่น 5",
  "ผู้เล่น 6","ผู้เล่น 7","ผู้เล่น 8","ผู้เล่น 9","ผู้เล่น 10",
];
const DEFAULT_ITEMS_EN = [
  "Player 1","Player 2","Player 3","Player 4","Player 5",
  "Player 6","Player 7","Player 8","Player 9","Player 10",
];

export function CardDrawGame() {
  const locale = useLocale();
  const isTh = locale === "th";

  const defaultItems = isTh ? DEFAULT_ITEMS_TH : DEFAULT_ITEMS_EN;
  const [inputText, setInputText] = useState(defaultItems.join("\n"));
  const [drawCount, setDrawCount] = useState(3);
  const [drawn, setDrawn] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const items = inputText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const safeDraw = Math.min(drawCount, items.length);

  const handleDraw = () => {
    // Shuffle all items (Fisher-Yates)
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDrawn(shuffled.slice(0, safeDraw));
    setRemaining(shuffled.slice(safeDraw));
    setHasDrawn(true);
    setAnimKey((k) => k + 1);
  };

  const handleReshuffle = () => {
    setDrawn([]);
    setRemaining([]);
    setHasDrawn(false);
  };

  return (
    <div className="space-y-4">
      {!hasDrawn ? (
        /* ---------------------------------------------------------------- */
        /* Setup screen                                                      */
        /* ---------------------------------------------------------------- */
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {isTh ? "รายการในกองไพ่ (1 รายการต่อบรรทัด)" : "Deck items (one per line)"}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="w-full border border-(--border) rounded-xl px-3 py-2 bg-background text-sm resize-none"
              placeholder={isTh ? DEFAULT_ITEMS_TH.join("\n") : DEFAULT_ITEMS_EN.join("\n")}
            />
            <p className="text-xs text-(--muted-foreground) mt-1">
              {items.length} {isTh ? "รายการ" : "items"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {isTh ? "จั่วกี่ใบ" : "Draw how many"}
              <span className="text-(--muted-foreground) font-normal ml-1">
                ({isTh ? "สูงสุด" : "max"} {items.length})
              </span>
            </label>
            <input
              type="number"
              min={1}
              max={items.length}
              value={drawCount}
              onChange={(e) =>
                setDrawCount(Math.max(1, Math.min(items.length, Number(e.target.value))))
              }
              className="w-full border border-(--border) rounded-lg px-3 py-2 bg-background text-sm"
            />
          </div>

          <button
            onClick={handleDraw}
            disabled={items.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-amber-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Layers size={18} />
            {isTh ? "จั่วไพ่!" : "Draw cards!"}
          </button>
        </div>
      ) : (
        /* ---------------------------------------------------------------- */
        /* Result screen                                                     */
        /* ---------------------------------------------------------------- */
        <div key={animKey} className="space-y-4">
          {/* Drawn cards */}
          <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {isTh ? "ไพ่ที่จั่วได้" : "Drawn cards"}
                <span className="ml-2 text-sm font-normal text-(--muted-foreground)">
                  ({drawn.length} {isTh ? "ใบ" : "cards"})
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {drawn.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative rounded-2xl p-4 text-white text-center font-bold shadow-md",
                    "bg-linear-to-br",
                    COLORS[i % COLORS.length],
                    "animate-in fade-in zoom-in-95 duration-300"
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Card number */}
                  <span className="absolute top-2 left-3 text-xs opacity-70">#{i + 1}</span>
                  {/* Suit decoration */}
                  <span className="absolute top-2 right-3 text-xs opacity-70">♠</span>
                  <p className="text-base mt-3 leading-snug wrap-break-word">{item}</p>
                  <span className="absolute bottom-2 right-3 text-xs opacity-70 rotate-180">♠</span>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining deck */}
          {remaining.length > 0 && (
            <div className="bg-(--card) border border-(--border) rounded-2xl p-5">
              <p className="text-sm font-medium text-(--muted-foreground) mb-3">
                {isTh ? "คงเหลือในกอง" : "Remaining in deck"}
                <span className="ml-1 text-foreground font-semibold">({remaining.length})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {remaining.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full bg-(--muted) text-(--muted-foreground)"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReshuffle}
              className="flex-1 flex items-center justify-center gap-2 border border-(--border) hover:bg-(--muted) font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <Shuffle size={16} />
              {isTh ? "สับไพ่ใหม่" : "Reshuffle"}
            </button>
            <button
              onClick={handleDraw}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors shadow shadow-amber-200 dark:shadow-none text-sm"
            >
              <Layers size={16} />
              {isTh ? "จั่วใหม่ (ชุดเดิม)" : "Draw again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
