"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useState } from "react";

// Static approximate rates relative to THB
const RATES: Record<string, number> = {
  THB: 1, USD: 34.5, EUR: 37.2, GBP: 43.5, JPY: 0.23,
  CNY: 4.75, SGD: 25.6, MYR: 7.8, HKD: 4.4, AUD: 22.0, CAD: 25.3, CHF: 38.5,
};

const CURRENCIES = Object.keys(RATES);

interface CurrencyState { amount: string; from: string; to: string; result: string }
const INITIAL: CurrencyState = { amount: "", from: "USD", to: "THB", result: "" };

export function CurrencyConverter() {
  const t = useTranslations("currency");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<CurrencyState>("sc_currency-converter_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const convert = () => {
    const v = parseFloat(state.amount);
    if (state.amount === "" || isNaN(v) || v <= 0) {
      setErrors({ amount: locale === "th" ? "กรุณากรอกจำนวนเงิน" : "Amount required" });
      return;
    }
    setErrors({});
    const inThb = v * RATES[state.from];
    const result = inThb / RATES[state.to];
    setValue((s) => ({ ...s, result: result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) }));
    logCalculatorEvent("currency-converter", locale);
  };

  const swap = () => setValue((s) => ({ ...s, from: s.to, to: s.from, result: "" }));

  return (
    <div className="space-y-4">
      <div className="calc-card space-y-5">
        <div>
          <label className="calc-label">{t("amount")}</label>
          <input
            type="number"
            value={state.amount}
            onChange={(e) => { setValue((s) => ({ ...s, amount: e.target.value, result: "" })); setErrors({}); }}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            placeholder="100"
            className={`calc-input${errors.amount ? " calc-input-error" : ""}`}
          />
          {errors.amount && <p className="field-error">⚠ {errors.amount}</p>}
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label className="calc-label">{t("from")}</label>
            <CurrencySelect value={state.from} onChange={(v) => setValue((s) => ({ ...s, from: v, result: "" }))} />
          </div>
          <button onClick={swap} className="mb-0.5 px-3 py-2.5 bg-(--muted) hover:bg-(--border) rounded-xl text-sm font-medium transition-colors">⇄</button>
          <div>
            <label className="calc-label">{t("to")}</label>
            <CurrencySelect value={state.to} onChange={(v) => setValue((s) => ({ ...s, to: v, result: "" }))} />
          </div>
        </div>
        <p className="text-xs text-(--muted-foreground)">{t("rate_note")}</p>
        <div className="flex gap-3 pt-1">
          <button onClick={convert} className="btn-primary flex-1">{tc("calculate")}</button>
          <button onClick={reset} className="btn-secondary">{tc("reset")}</button>
        </div>
      </div>
      {state.result && (
        <div className="result-card">
          <p className="text-sm text-(--muted-foreground) mb-1">{tc("result")}</p>
          <p className="text-4xl font-bold">{state.result} <span className="text-2xl text-(--muted-foreground)">{state.to}</span></p>
          <p className="text-sm text-(--muted-foreground) mt-2">
            1 {state.from} = {(RATES[state.from] / RATES[state.to]).toFixed(4)} {state.to}
          </p>
        </div>
      )}
    </div>
  );
}

function CurrencySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="calc-input"
    >
      {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}
