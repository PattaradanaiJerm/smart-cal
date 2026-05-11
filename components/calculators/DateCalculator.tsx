"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

type Mode = "diff" | "add";
interface DateState { mode: Mode; date1: string; date2: string; days: string; result: string }
const today = new Date().toISOString().slice(0, 10);
const INITIAL: DateState = { mode: "diff", date1: today, date2: today, days: "", result: "" };

export function DateCalculator() {
  const t = useTranslations("date");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<DateState>("sc_date-calculator_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const calculate = () => {
    if (state.mode === "diff") {
      const d1 = new Date(state.date1);
      const d2 = new Date(state.date2);
      const msPerDay = 86400000;
      const calDays = Math.round((d2.getTime() - d1.getTime()) / msPerDay);
      let weekdays = 0;
      const start = new Date(Math.min(d1.getTime(), d2.getTime()));
      const end = new Date(Math.max(d1.getTime(), d2.getTime()));
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) weekdays++;
      }
      setValue((s) => ({
        ...s,
        result: `${t("calendar_days")}: ${Math.abs(calDays)} | ${t("weekdays")}: ${weekdays}`,
      }));
    } else {
      const base = new Date(state.date1);
      base.setDate(base.getDate() + parseInt(state.days || "0"));
      setValue((s) => ({
        ...s,
        result: base.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        }),
      }));
    }
    logCalculatorEvent("date-calculator", locale);
  };

  return (
    <div className="space-y-4">
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        <div className="flex gap-2">
          {(["diff", "add"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setValue((s) => ({ ...s, mode: m, result: "" }))}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${state.mode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-(--muted) border-(--border)"}`}>
              {t(`mode_${m}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{state.mode === "diff" ? t("start_date") : t("base_date")}</label>
          <input type="date" value={state.date1} onChange={(e) => setValue((s) => ({ ...s, date1: e.target.value, result: "" }))}
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        {state.mode === "diff" ? (
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("end_date")}</label>
            <input type="date" value={state.date2} onChange={(e) => setValue((s) => ({ ...s, date2: e.target.value, result: "" }))}
              className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("days_to_add")}</label>
            <input type="number" value={state.days} onChange={(e) => setValue((s) => ({ ...s, days: e.target.value, result: "" }))} placeholder="30"
              className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">{tc("calculate")}</button>
          <button onClick={reset} className="px-4 bg-(--muted) hover:bg-(--border) rounded-xl text-sm transition-colors">{tc("reset")}</button>
        </div>
      </div>

      {state.result && (
        <div className="result-card bg-(--card) border border-(--border) rounded-2xl p-6">
          <p className="text-sm text-(--muted-foreground) mb-2">{tc("result")}</p>
          <p className="text-xl font-bold">{state.result}</p>
        </div>
      )}
    </div>
  );
}
