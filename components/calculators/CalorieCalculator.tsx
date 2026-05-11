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
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("gender")}</label>
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
            <label className="block text-sm font-medium mb-1.5">{label}</label>
            <input type="number" value={state[key]} onChange={(e) => setValue((s) => ({ ...s, [key]: e.target.value, result: null }))} placeholder={placeholder}
              className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1.5">{t("activity")}</label>
          <select value={state.activity} onChange={(e) => setValue((s) => ({ ...s, activity: +e.target.value, result: null }))}
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {ACTIVITY.map((a) => <option key={a.key} value={a.factor}>{t(`activity_${a.key}` as Parameters<typeof t>[0])}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{t("goal")}</label>
          <select value={state.goal} onChange={(e) => setValue((s) => ({ ...s, goal: e.target.value as CalState["goal"], result: null }))}
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {(["maintain", "lose", "gain"] as const).map((g) => <option key={g} value={g}>{t(`goal_${g}` as Parameters<typeof t>[0])}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">{tc("calculate")}</button>
          <button onClick={reset} className="px-4 bg-(--muted) hover:bg-(--border) rounded-xl text-sm transition-colors">{tc("reset")}</button>
        </div>
      </div>

      {state.result && (
        <div className="result-card bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
          {[
            { label: t("bmr"), value: state.result.bmr, color: "" },
            { label: t("tdee"), value: state.result.tdee, color: "text-indigo-600 dark:text-indigo-400" },
            { label: tc("result"), value: state.result.target, color: "text-green-600 dark:text-green-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center border-b border-(--border) pb-3 last:border-0 last:pb-0">
              <span className="text-sm text-(--muted-foreground)">{label}</span>
              <span className={`text-xl font-bold ${color}`}>{value.toLocaleString()} kcal</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
