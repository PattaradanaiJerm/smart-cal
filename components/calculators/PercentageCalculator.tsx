"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

type Mode = "basic" | "change" | "ratio";
interface PercentState {
  mode: Mode;
  a: string; b: string;
  result: string;
}
const INITIAL: PercentState = { mode: "basic", a: "", b: "", result: "" };

export function PercentageCalculator() {
  const t = useTranslations("percentage");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<PercentState>("sc_percentage-calculator_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const calculate = () => {
    const a = parseFloat(state.a);
    const b = parseFloat(state.b);
    if (isNaN(a) || isNaN(b)) return;

    let result = "";
    if (state.mode === "basic") result = `${((a / 100) * b).toFixed(4)}`;
    else if (state.mode === "change") {
      const pct = ((b - a) / Math.abs(a)) * 100;
      result = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
    } else {
      result = `${((a / b) * 100).toFixed(2)}%`;
    }
    setValue((s) => ({ ...s, result }));
    logCalculatorEvent("percentage-calculator", locale);
  };

  const labels: Record<Mode, [string, string]> = {
    basic: [t("percent"), t("of_value")],
    change: [t("from_val"), t("to_val")],
    ratio: [t("part"), t("whole")],
  };

  return (
    <div className="space-y-4">
      <div className="calc-card space-y-5">
        {/* Mode selector */}
        <div className="flex bg-(--muted) rounded-xl p-1 gap-1">
          {(["basic", "change", "ratio"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setValue((s) => ({ ...s, mode: m, result: "" }))}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${state.mode === m ? "bg-white dark:bg-(--card) text-indigo-600 shadow-sm" : "text-(--muted-foreground)"}`}
            >
              {t(`mode_${m}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        {labels[state.mode].map((label, i) => (
          <div key={i}>
            <label className="calc-label">{label}</label>
            <input
              type="number"
              value={i === 0 ? state.a : state.b}
              onChange={(e) => setValue((s) => ({ ...s, [i === 0 ? "a" : "b"]: e.target.value, result: "" }))}
              placeholder="0"
              className="calc-input"
            />
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="btn-primary flex-1">{tc("calculate")}</button>
          <button onClick={reset} className="btn-secondary">{tc("reset")}</button>
        </div>
      </div>

      {state.result && (
        <div className="result-card">
          <p className="text-sm text-(--muted-foreground) mb-1">{tc("result")}</p>
          <p className="text-4xl font-bold">{state.result}</p>
        </div>
      )}
    </div>
  );
}
