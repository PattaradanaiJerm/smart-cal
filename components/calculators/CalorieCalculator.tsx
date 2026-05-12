"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

const ACTIVITY = [
  { key: "sedentary", factor: 1.2 },
  { key: "light", factor: 1.375 },
  { key: "moderate", factor: 1.55 },
  { key: "active", factor: 1.725 },
  { key: "very_active", factor: 1.9 },
];

interface CalState {
  gender: "male" | "female";
  age: string; weight: string; height: string;
  activity: number;
  goal: "maintain" | "lose" | "gain";
  result: { bmr: number; tdee: number; target: number } | null;
}
const INITIAL: CalState = { gender: "male", age: "", weight: "", height: "", activity: 1.55, goal: "maintain", result: null };

export function CalorieCalculator() {
  const t = useTranslations("calorie");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<CalState>("sc_calorie-calculator_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const calculate = () => {
    const w = parseFloat(state.weight);
    const h = parseFloat(state.height);
    const a = parseFloat(state.age);
    if (!w || !h || !a) return;

    const bmr = state.gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * state.activity;
    const offset = state.goal === "lose" ? -500 : state.goal === "gain" ? 500 : 0;

    setValue((s) => ({
      ...s,
      result: { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(tdee + offset) },
    }));
    logCalculatorEvent("calorie-calculator", locale);
  };

  return (
    <div className="space-y-4">
      <div className="calc-card space-y-5">
        {/* Gender */}
        <div>
          <label className="calc-label">{t("gender")}</label>
          <div className="flex gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setValue((s) => ({ ...s, gender: g, result: null }))}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${state.gender === g ? "bg-indigo-600 text-white border-indigo-600" : "bg-(--muted) border-(--border)"}`}
              >
                {t(g)}
              </button>
            ))}
          </div>
        </div>

        {[
          { label: t("age"), key: "age" as const, placeholder: "25" },
          { label: t("weight"), key: "weight" as const, placeholder: "65" },
          { label: t("height"), key: "height" as const, placeholder: "170" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="calc-label">{label}</label>
            <input type="number" value={state[key]} onChange={(e) => setValue((s) => ({ ...s, [key]: e.target.value, result: null }))} onKeyDown={(e) => e.key === "Enter" && calculate()} placeholder={placeholder}
              className="calc-input" />
          </div>
        ))}

        <div>
          <label className="calc-label">{t("activity")}</label>
          <select value={state.activity} onChange={(e) => setValue((s) => ({ ...s, activity: +e.target.value, result: null }))}
            className="calc-input">
            {ACTIVITY.map((a) => <option key={a.key} value={a.factor}>{t(`activity_${a.key}` as Parameters<typeof t>[0])}</option>)}
          </select>
        </div>

        <div>
          <label className="calc-label">{t("goal")}</label>
          <select value={state.goal} onChange={(e) => setValue((s) => ({ ...s, goal: e.target.value as CalState["goal"], result: null }))}
            className="calc-input">
            {(["maintain", "lose", "gain"] as const).map((g) => <option key={g} value={g}>{t(`goal_${g}` as Parameters<typeof t>[0])}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="btn-primary flex-1">{tc("calculate")}</button>
          <button onClick={reset} className="btn-secondary">{tc("reset")}</button>
        </div>
      </div>

      {state.result && (
        <div className="result-card space-y-4">
          {[
            { label: t("bmr"), value: state.result.bmr, color: "" },
            { label: t("tdee"), value: state.result.tdee, color: "text-indigo-600 dark:text-indigo-400" },
            { label: tc("result"), value: state.result.target, color: "text-green-600 dark:text-green-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-row">
              <span className="text-sm text-(--muted-foreground)">{label}</span>
              <span className={`text-xl font-bold ${color}`}>{value.toLocaleString()} kcal</span>
            </div>
          ))}

          {/* BMR → TDEE → Target stacked bars */}
          {(() => {
            const max = Math.max(state.result.bmr, state.result.tdee, state.result.target) * 1.1;
            const bars = [
              { label: t("bmr"), value: state.result.bmr, color: "bg-(--muted-foreground)/60" },
              { label: t("tdee"), value: state.result.tdee, color: "bg-indigo-500" },
              { label: tc("result"), value: state.result.target, color: "bg-green-500" },
            ];
            return (
              <div className="pt-2 border-t border-(--border) space-y-2">
                {bars.map((b) => (
                  <div key={b.label} className="space-y-1">
                    <div className="flex justify-between text-xs text-(--muted-foreground)">
                      <span>{b.label}</span>
                      <span className="font-semibold">{b.value.toLocaleString()} kcal</span>
                    </div>
                    <div className="h-2 rounded-full bg-(--muted) overflow-hidden">
                      <div
                        className={`h-full rounded-full ${b.color} transition-all duration-700`}
                        style={{ width: `${(b.value / max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
