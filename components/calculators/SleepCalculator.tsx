"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

type Mode = "bedtime" | "wake";
interface SleepState { mode: Mode; time: string; results: string[] }
const INITIAL: SleepState = { mode: "bedtime", time: "07:00", results: [] };
const CYCLE_MIN = 90;
const FALL_ASLEEP = 14; // avg minutes to fall asleep

export function SleepCalculator() {
  const t = useTranslations("sleep");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<SleepState>("sc_sleep-calculator_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const addMinutes = (base: Date, mins: number) => {
    const d = new Date(base);
    d.setMinutes(d.getMinutes() + mins);
    return d;
  };

  const fmt = (d: Date) => d.toLocaleTimeString(locale === "th" ? "th-TH" : "en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const calculate = () => {
    const [h, m] = state.time.split(":").map(Number);
    const base = new Date();
    base.setHours(h, m, 0, 0);

    const results: string[] = [];
    if (state.mode === "bedtime") {
      // User wants to wake at X → suggest bedtimes (going back in cycles from wake time)
      for (let cycles = 6; cycles >= 3; cycles--) {
        const bedtime = addMinutes(base, -(cycles * CYCLE_MIN + FALL_ASLEEP));
        results.push(`${fmt(bedtime)} (${cycles} ${t("cycles")}, ${Math.round(cycles * CYCLE_MIN / 60 * 10) / 10}h)`);
      }
    } else {
      // User wants to sleep at X → suggest wake times (going forward in cycles)
      for (let cycles = 6; cycles >= 3; cycles--) {
        const wakeTime = addMinutes(base, cycles * CYCLE_MIN + FALL_ASLEEP);
        results.push(`${fmt(wakeTime)} (${cycles} ${t("cycles")}, ${Math.round(cycles * CYCLE_MIN / 60 * 10) / 10}h)`);
      }
    }
    setValue((s) => ({ ...s, results }));
    logCalculatorEvent("sleep-calculator", locale);
  };

  return (
    <div className="space-y-4">
      <div className="calc-card space-y-5">
        <div className="flex gap-2">
          {(["bedtime", "wake"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setValue((s) => ({ ...s, mode: m, results: [] }))}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${state.mode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-(--muted) border-(--border)"}`}>
              {t(`mode_${m}` as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        <div>
          <label className="calc-label">{state.mode === "bedtime" ? t("wake_time") : t("bedtime")}</label>
          <input type="time" value={state.time} onChange={(e) => setValue((s) => ({ ...s, time: e.target.value, results: [] }))}
            className="calc-input" />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="btn-primary flex-1">{tc("calculate")}</button>
          <button onClick={reset} className="btn-secondary">{tc("reset")}</button>
        </div>
      </div>

      {state.results.length > 0 && (
        <div className="result-card">
          <p className="text-sm font-semibold text-(--muted-foreground) mb-3">
            {state.mode === "bedtime" ? t("sleep_times") : t("wake_times")}
          </p>
          <ul className="space-y-2">
            {state.results.map((r, i) => (
              <li key={i} className="flex items-center gap-3 text-lg font-semibold">
                <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-green-500" : i === 1 ? "bg-indigo-500" : "bg-(--muted-foreground)"}`} />
                {r}
              </li>
            ))}
          </ul>
          <p className="text-xs text-(--muted-foreground) mt-4">{t("tip")}</p>
        </div>
      )}
    </div>
  );
}
