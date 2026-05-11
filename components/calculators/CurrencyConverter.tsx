"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

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

  const convert = () => {
    const v = parseFloat(state.amount);
    if (isNaN(v)) return;
    const inThb = v * RATES[state.from];
    const result = inThb / RATES[state.to];
    setValue((s) => ({ ...s, result: result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) }));
    logCalculatorEvent("currency-converter", locale);
  };

  const swap = () => setValue((s) => ({ ...s, from: s.to, to: s.from, result: "" }));

  return (
    <div className="space-y-4">
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t("amount")}</label>
          <input
            type="number"
            value={state.amount}
            onChange={(e) => setValue((s) => ({ ...s, amount: e.target.value, result: "" }))}
            placeholder="100"
            className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("from")}</label>
            <CurrencySelect value={state.from} onChange={(v) => setValue((s) => ({ ...s, from: v, result: "" }))} />
          </div>
          <button onClick={swap} className="mb-0.5 px-3 py-2.5 bg-(--muted) hover:bg-(--border) rounded-xl text-sm font-medium transition-colors">⇄</button>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t("to")}</label>
            <CurrencySelect value={state.to} onChange={(v) => setValue((s) => ({ ...s, to: v, result: "" }))} />
          </div>
        </div>
        <p className="text-xs text-(--muted-foreground)">{t("rate_note")}</p>
        <div className="flex gap-3 pt-1">
          <button onClick={convert} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">{tc("calculate")}</button>
          <button onClick={reset} className="px-4 bg-(--muted) hover:bg-(--border) rounded-xl text-sm transition-colors">{tc("reset")}</button>
        </div>
      </div>
      {state.result && (
        <div className="result-card bg-(--card) border border-(--border) rounded-2xl p-6">
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
      className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}
