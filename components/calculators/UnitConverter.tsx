"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

type Category = "length" | "weight" | "temperature" | "area" | "volume" | "speed";

const units: Record<Category, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { label: "เมตร (m)", toBase: (v) => v, fromBase: (v) => v },
    { label: "กิโลเมตร (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "เซนติเมตร (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "มิลลิเมตร (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "ไมล์ (mi)", toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    { label: "ฟุต (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "นิ้ว (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { label: "กิโลกรัม (kg)", toBase: (v) => v, fromBase: (v) => v },
    { label: "กรัม (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "มิลลิกรัม (mg)", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
    { label: "ตัน (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "ปอนด์ (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { label: "ออนซ์ (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  ],
  temperature: [
    { label: "เซลเซียส (°C)", toBase: (v) => v, fromBase: (v) => v },
    { label: "ฟาเรนไฮต์ (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { label: "เคลวิน (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  area: [
    { label: "ตร.เมตร (m²)", toBase: (v) => v, fromBase: (v) => v },
    { label: "ตร.กิโลเมตร (km²)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { label: "ตร.เซนติเมตร (cm²)", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { label: "ไร่", toBase: (v) => v * 1600, fromBase: (v) => v / 1600 },
    { label: "เอเคอร์ (ac)", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
  ],
  volume: [
    { label: "ลิตร (L)", toBase: (v) => v, fromBase: (v) => v },
    { label: "มิลลิลิตร (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "ลูกบาศก์เมตร (m³)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "แกลลอน US (gal)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  ],
  speed: [
    { label: "กม./ชม. (km/h)", toBase: (v) => v, fromBase: (v) => v },
    { label: "เมตร/วิ (m/s)", toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
    { label: "ไมล์/ชม. (mph)", toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
    { label: "นอต (kn)", toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
  ],
};

interface UnitState {
  category: Category;
  fromIdx: number;
  toIdx: number;
  input: string;
  result: string;
}

const INITIAL: UnitState = { category: "length", fromIdx: 0, toIdx: 1, input: "", result: "" };

export function UnitConverter() {
  const t = useTranslations("unit");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<UnitState>("sc_unit-converter_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const convert = () => {
    const v = parseFloat(state.input);
    if (isNaN(v)) return;
    const list = units[state.category];
    const base = list[state.fromIdx].toBase(v);
    const result = list[state.toIdx].fromBase(base);
    const formatted = parseFloat(result.toPrecision(8)).toString();
    setValue((s) => ({ ...s, result: formatted }));
    logCalculatorEvent("unit-converter", locale);
  };

  const currentUnits = units[state.category];

  return (
    <div className="space-y-4">
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("category")}</label>
          <select
            value={state.category}
            onChange={(e) => setValue((s) => ({ ...s, category: e.target.value as Category, fromIdx: 0, toIdx: 1, result: "" }))}
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {(Object.keys(units) as Category[]).map((cat) => (
              <option key={cat} value={cat}>
                {t(`categories.${cat}` as Parameters<typeof t>[0])}
              </option>
            ))}
          </select>
        </div>

        {/* Value + from unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("value")}</label>
            <input
              type="number"
              value={state.input}
              onChange={(e) => setValue((s) => ({ ...s, input: e.target.value, result: "" }))}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("from_unit")}</label>
            <select
              value={state.fromIdx}
              onChange={(e) => setValue((s) => ({ ...s, fromIdx: +e.target.value, result: "" }))}
              className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currentUnits.map((u, i) => (
                <option key={i} value={i}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* To unit */}
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("to_unit")}</label>
          <select
            value={state.toIdx}
            onChange={(e) => setValue((s) => ({ ...s, toIdx: +e.target.value, result: "" }))}
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {currentUnits.map((u, i) => (
              <option key={i} value={i}>{u.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={convert} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
            {tc("calculate")}
          </button>
          <button onClick={reset} className="px-4 bg-(--muted) hover:bg-(--border) rounded-xl transition-colors text-sm">
            {tc("reset")}
          </button>
        </div>
      </div>

      {state.result !== "" && (
        <div className="result-card bg-(--card) border border-(--border) rounded-2xl p-6">
          <p className="text-sm text-(--muted-foreground) mb-1">{tc("result")}</p>
          <p className="text-4xl font-bold break-all">
            {state.result} <span className="text-2xl text-(--muted-foreground)">{currentUnits[state.toIdx].label}</span>
          </p>
        </div>
      )}
    </div>
  );
}
