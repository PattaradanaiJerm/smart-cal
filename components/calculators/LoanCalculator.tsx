"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useState } from "react";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const errs: Record<string, string> = {};
    if (!state.principal || parseFloat(state.principal) <= 0) errs.principal = locale === "th" ? "กรุณากรอกยอดเงินกู้" : "Loan amount required";
    if (!state.rate || parseFloat(state.rate) <= 0) errs.rate = locale === "th" ? "กรุณากรอกอัตราดอกเบี้ย" : "Interest rate required";
    if (!state.months || parseInt(state.months) <= 0) errs.months = locale === "th" ? "กรุณากรอกระยะเวลา" : "Term required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const P = parseFloat(state.principal);
    const annualRate = parseFloat(state.rate);
    const n = parseInt(state.months);
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
      <div className="calc-card space-y-5">
        {[
          { label: t("principal"), key: "principal" as const, placeholder: "1,000,000" },
          { label: t("interest_rate"), key: "rate" as const, placeholder: "5.5" },
          { label: t("term_months"), key: "months" as const, placeholder: "120" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="calc-label">{label}</label>
            <input
              type="number"
              value={state[key]}
              onChange={(e) => { setValue((s) => ({ ...s, [key]: e.target.value, result: null })); setErrors(p => ({ ...p, [key]: "" })); }}
              onKeyDown={(e) => e.key === "Enter" && calculate()}
              placeholder={placeholder}
              className={`calc-input${errors[key] ? " calc-input-error" : ""}`}
            />
            {errors[key] && <p className="field-error">⚠ {errors[key]}</p>}
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="btn-primary flex-1">{tc("calculate")}</button>
          <button onClick={reset} className="btn-secondary">{tc("reset")}</button>
        </div>
      </div>

      {state.result && (
        <div className="result-card space-y-4">
          {[
            { label: t("monthly_payment"), value: fmt(state.result.monthly), highlight: true },
            { label: t("total_payment"), value: fmt(state.result.total) },
            { label: t("total_interest"), value: fmt(state.result.interest), color: "text-red-500" },
          ].map(({ label, value, highlight, color }) => (
            <div key={label} className="stat-row">
              <span className="text-sm text-(--muted-foreground)">{label}</span>
              <span className={`text-xl font-bold ${color ?? (highlight ? "text-indigo-600 dark:text-indigo-400" : "")}`}>
                ฿{value}
              </span>
            </div>
          ))}

          {/* Principal vs Interest breakdown bar */}
          {(() => {
            const principal = parseFloat(state.principal) || 0;
            const interestPct = Math.round((state.result.interest / state.result.total) * 100);
            const principalPct = 100 - interestPct;
            return (
              <div className="pt-2 border-t border-(--border) space-y-2">
                <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-widest">สัดส่วนเงินต้น vs ดอกเบี้ย</p>
                <div className="h-3 rounded-full overflow-hidden bg-(--muted) flex">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-700 rounded-l-full"
                    style={{ width: `${principalPct}%` }}
                  />
                  <div
                    className="h-full bg-red-400 transition-all duration-700 rounded-r-full"
                    style={{ width: `${interestPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-(--muted-foreground)">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />เงินต้น {principalPct}%</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />ดอกเบี้ย {interestPct}%</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
