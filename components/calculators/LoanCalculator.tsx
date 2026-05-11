"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

interface LoanState {
  principal: string;
  rate: string;
  months: string;
  result: { monthly: number; total: number; interest: number } | null;
}

const INITIAL: LoanState = { principal: "", rate: "", months: "", result: null };

export function LoanCalculator() {
  const t = useTranslations("loan");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<LoanState>("sc_loan-calculator_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const calculate = () => {
    const P = parseFloat(state.principal);
    const annualRate = parseFloat(state.rate);
    const n = parseInt(state.months);
    if (!P || !annualRate || !n) return;

    const r = annualRate / 100 / 12;
    const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - P;

    setValue((s) => ({ ...s, result: { monthly: Math.round(monthly * 100) / 100, total: Math.round(total * 100) / 100, interest: Math.round(interest * 100) / 100 } }));
    logCalculatorEvent("loan-calculator", locale);
  };

  const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        {[
          { label: t("principal"), key: "principal" as const, placeholder: "1,000,000" },
          { label: t("interest_rate"), key: "rate" as const, placeholder: "5.5" },
          { label: t("term_months"), key: "months" as const, placeholder: "120" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1.5">{label}</label>
            <input
              type="number"
              value={state[key]}
              onChange={(e) => setValue((s) => ({ ...s, [key]: e.target.value, result: null }))}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">{tc("calculate")}</button>
          <button onClick={reset} className="px-4 bg-(--muted) hover:bg-(--border) rounded-xl text-sm transition-colors">{tc("reset")}</button>
        </div>
      </div>

      {state.result && (
        <div className="result-card bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
          {[
            { label: t("monthly_payment"), value: fmt(state.result.monthly), highlight: true },
            { label: t("total_payment"), value: fmt(state.result.total) },
            { label: t("total_interest"), value: fmt(state.result.interest), color: "text-red-500" },
          ].map(({ label, value, highlight, color }) => (
            <div key={label} className="flex justify-between items-center border-b border-(--border) pb-3 last:border-0 last:pb-0">
              <span className="text-sm text-(--muted-foreground)">{label}</span>
              <span className={`text-xl font-bold ${color ?? (highlight ? "text-indigo-600 dark:text-indigo-400" : "")}`}>
                ฿{value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
