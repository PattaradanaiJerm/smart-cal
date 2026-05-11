"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";

// ---------------------------------------------------------------------------
// Wheel colours
// ---------------------------------------------------------------------------
const COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#f43f5e","#f97316",
  "#eab308","#22c55e","#14b8a6","#3b82f6","#06b6d4",
  "#a855f7","#10b981","#ef4444","#f59e0b","#0ea5e9",
];

const DEFAULT_ITEMS_TH = ["ตัวเลือก 1","ตัวเลือก 2","ตัวเลือก 3","ตัวเลือก 4","ตัวเลือก 5","ตัวเลือก 6"];
const DEFAULT_ITEMS_EN = ["Option 1","Option 2","Option 3","Option 4","Option 5","Option 6"];

// ---------------------------------------------------------------------------
// SVG Wheel
// ---------------------------------------------------------------------------
function SpinWheel({
  items,
  rotation,
  spinning,
}: {
  items: string[];
  rotation: number;
  spinning: boolean;
}) {
  const N = items.length;
  if (N < 2) return null;

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - 4;
  const segAngle = 360 / N;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Pointer at top */}
      <div
        className="absolute z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
      >
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "24px solid #ef4444",
          }}
        />
      </div>

      <svg
        width={size}
        height={size}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "none",
        }}
      >
        {items.map((item, i) => {
          const startDeg = i * segAngle - 90;
          const endDeg = (i + 1) * segAngle - 90;
          const x1 = cx + r * Math.cos(toRad(startDeg));
          const y1 = cy + r * Math.sin(toRad(startDeg));
          const x2 = cx + r * Math.cos(toRad(endDeg));
          const y2 = cy + r * Math.sin(toRad(endDeg));
          const largeArc = segAngle > 180 ? 1 : 0;
          const color = COLORS[i % COLORS.length];

          // Text in mid-segment, radially oriented
          const midDeg = startDeg + segAngle / 2;
          const textR = r * 0.62;
          const tx = cx + textR * Math.cos(toRad(midDeg));
          const ty = cy + textR * Math.sin(toRad(midDeg));
          const maxLen = N > 8 ? 6 : 9;
          const label = item.length > maxLen ? item.slice(0, maxLen - 1) + "…" : item;

          return (
            <g key={i}>
              <path
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={N > 10 ? 9 : 11}
                fontWeight="bold"
                transform={`rotate(${midDeg + 90}, ${tx}, ${ty})`}
              >
                {label}
              </text>
            </g>
          );
        })}
        {/* Center hub */}
        <circle cx={cx} cy={cy} r={22} fill="white" stroke="#e2e8f0" strokeWidth="3" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="16">
          🎯
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function SpinWheelGame() {
  const locale = useLocale();
  const isTh = locale === "th";

  const defaultItems = isTh ? DEFAULT_ITEMS_TH : DEFAULT_ITEMS_EN;
  const [inputText, setInputText] = useState(defaultItems.join("\n"));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const accRotation = useRef(0);

  const items = inputText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const spin = () => {
    if (spinning || items.length < 2) return;

    const N = items.length;
    const segAngle = 360 / N;
    const idx = Math.floor(Math.random() * N);

    // Target: center of segment idx lands at the pointer (top, 270° in SVG coords)
    // Formula: targetMod = (N - idx - 0.5) * segAngle
    const targetMod = (N - idx - 0.5) * segAngle;
    const currentMod = accRotation.current % 360;
    let diff = targetMod - currentMod;
    if (diff < 0) diff += 360;

    const totalRotation = accRotation.current + (5 + Math.floor(Math.random() * 4)) * 360 + diff;
    accRotation.current = totalRotation;

    setSpinning(true);
    setWinner(null);
    setWinnerIdx(null);
    setRotation(totalRotation);

    setTimeout(() => {
      setWinner(items[idx]);
      setWinnerIdx(idx);
      setSpinning(false);
    }, 4200);
  };

  const tooFew = items.length < 2;

  return (
    <div className="space-y-4">
      {/* Input + wheel layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Input */}
        <div className="bg-(--card) border border-(--border) rounded-2xl p-5 space-y-3">
          <label className="block text-sm font-medium">
            {isTh ? "รายการ (1 รายการต่อบรรทัด)" : "Options (one per line)"}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setWinner(null);
              setWinnerIdx(null);
            }}
            rows={10}
            className="w-full border border-(--border) rounded-xl px-3 py-2 bg-background text-sm resize-none"
            placeholder={isTh ? "ใส่รายการที่นี่...\nตัวเลือก 1\nตัวเลือก 2" : "Enter options...\nOption 1\nOption 2"}
          />
          <p className="text-xs text-(--muted-foreground)">
            {items.length} {isTh ? "รายการ" : "items"}
            {items.length > 15 && (
              <span className="text-yellow-500 ml-1">
                ({isTh ? "แนะนำไม่เกิน 15 รายการ" : "15 items recommended max"})
              </span>
            )}
          </p>
          {tooFew && (
            <p className="text-sm text-red-500">
              {isTh ? "ใส่อย่างน้อย 2 รายการ" : "Add at least 2 items"}
            </p>
          )}
        </div>

        {/* Wheel + spin btn */}
        <div className="flex flex-col items-center gap-4">
          {items.length >= 2 ? (
            <SpinWheel items={items} rotation={rotation} spinning={spinning} />
          ) : (
            <div
            className="w-75 h-75 rounded-full border-2 border-dashed border-(--border) flex items-center justify-center text-(--muted-foreground) text-sm">
              {isTh ? "ใส่รายการเพื่อแสดงวงล้อ" : "Add items to see the wheel"}
            </div>
          )}

          <button
            onClick={spin}
            disabled={spinning || tooFew}
            className={cn(
              "w-full max-w-75 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-colors",
              spinning || tooFew
                ? "bg-(--muted) text-(--muted-foreground) cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
            )}
          >
            <RotateCw size={18} className={cn(spinning && "animate-spin")} />
            {spinning
              ? isTh ? "กำลังหมุน..." : "Spinning..."
              : isTh ? "หมุนวงล้อ!" : "Spin!"}
          </button>
        </div>
      </div>

      {/* Result */}
      {winner !== null && !spinning && (
        <div className="bg-(--card) border-2 border-indigo-300 dark:border-indigo-700 rounded-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-wider mb-2">
            {isTh ? "ผลลัพธ์" : "Result"}
          </p>
          <div
            className="inline-block px-4 py-2 rounded-xl text-white font-bold text-2xl mb-1"
            style={{ backgroundColor: winnerIdx !== null ? COLORS[winnerIdx % COLORS.length] : "#6366f1" }}
          >
            {winner}
          </div>
          <p className="text-sm text-(--muted-foreground) mt-2">
            🎉 {isTh ? "ยินดีด้วย!" : "Congratulations!"}
          </p>
        </div>
      )}
    </div>
  );
}
