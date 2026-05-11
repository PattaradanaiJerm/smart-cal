"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

interface AgeState {
  birthdate: string;
  refDate: string;
  result: { years: number; months: number; days: number; nextBirthday: string; daysUntil: number } | null;
}

const today = new Date().toISOString().slice(0, 10);
const INITIAL: AgeState = { birthdate: "", refDate: today, result: null };

export function AgeCalculator() {
  const t = useTranslations("age");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<AgeState>("sc_age-calculator_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const calculate = () => {
    if (!state.birthdate) return;
    const birth = new Date(state.birthdate);
    const ref = new Date(state.refDate || today);

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Next birthday
    let nextBD = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBD <= ref) nextBD = new Date(ref.getFullYear() + 1, birth.getMonth(), birth.getDate());
    const daysUntil = Math.round((nextBD.getTime() - ref.getTime()) / 86400000);
    const nextBirthday = nextBD.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      day: "numeric", month: "long", year: "numeric",
    });

    setValue((s) => ({ ...s, result: { years, months, days, nextBirthday, daysUntil } }));
    logCalculatorEvent("age-calculator", locale);
  };

  return (
    <div className="space-y-4">
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("birthdate")}</label>
          <input
            type="date"
            value={state.birthdate}
            onChange={(e) => setValue((s) => ({ ...s, birthdate: e.target.value, result: null }))}
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("reference_date")}</label>
          <input
            type="date"
            value={state.refDate}
            onChange={(e) => setValue((s) => ({ ...s, refDate: e.target.value, result: null }))}
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
            {tc("calculate")}
          </button>
          <button onClick={reset} className="px-4 bg-(--muted) hover:bg-(--border) rounded-xl transition-colors text-sm">
            {tc("reset")}
          </button>
        </div>
      </div>

      {state.result && (
        <div className="result-card bg-(--card) border border-(--border) rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { val: state.result.years, label: t("years") },
              { val: state.result.months, label: t("months") },
              { val: state.result.days, label: t("days") },
            ].map(({ val, label }) => (
              <div key={label} className="text-center bg-indigo-50 dark:bg-indigo-950/40 rounded-xl p-3">
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{val}</p>
                <p className="text-xs text-(--muted-foreground) mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="text-sm text-(--muted-foreground) border-t border-(--border) pt-4">
            <span className="font-medium text-foreground">{t("next_birthday")}:</span>{" "}
            {state.result.nextBirthday}
            {" — "}
            {t("days_until").replace("{days}", String(state.result.daysUntil))}
          </div>
        </div>
      )}
    </div>
  );
}
