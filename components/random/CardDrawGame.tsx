"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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

export function CardDrawGame() {
  const t = useTranslations("card_draw");

  const [inputText, setInputText] = useState(() => t("default_items"));
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
        <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("deck_label")}</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="w-full border border-(--border) rounded-xl px-3 py-2 bg-background text-sm resize-none"
              placeholder={t("placeholder")}
            />
            <p className="text-xs text-(--muted-foreground) mt-1">
              {items.length} {t("items_suffix")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("draw_count")}
              <span className="text-(--muted-foreground) font-normal ml-1">
                ({t("max_label")} {items.length})
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
            {t("draw_btn")}
          </button>
        </div>
      ) : (
        <div key={animKey} className="space-y-4">
          <div className="bg-(--card) border border-(--border) rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {t("drawn_label")}
                <span className="ml-2 text-sm font-normal text-(--muted-foreground)">
                  ({drawn.length} {t("cards_suffix")})
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
                  <span className="absolute top-2 left-3 text-xs opacity-70">#{i + 1}</span>
                  <p className="text-base mt-3 leading-snug wrap-break-word">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {remaining.length > 0 && (
            <div className="bg-(--card) border border-(--border) rounded-2xl p-5">
              <p className="text-sm font-medium text-(--muted-foreground) mb-3">
                {t("remaining")}
                <span className="ml-1 text-foreground font-semibold">({remaining.length})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {remaining.map((item, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-(--muted) text-(--muted-foreground)">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleReshuffle}
              className="flex-1 flex items-center justify-center gap-2 border border-(--border) hover:bg-(--muted) font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <Shuffle size={16} />
              {t("reshuffle")}
            </button>
            <button
              onClick={handleDraw}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors shadow shadow-amber-200 dark:shadow-none text-sm"
            >
              <Layers size={16} />
              {t("draw_again")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
