"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useState, useEffect, useRef } from "react";
import { RefreshCw, ChevronDown, Search, X } from "lucide-react";

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.925, GBP: 0.79, JPY: 144.5,
  THB: 34.5, CNY: 7.25, SGD: 1.35, MYR: 4.7,
  HKD: 7.82, AUD: 1.55, CAD: 1.38, CHF: 0.9,
};

interface CurrencyState { amount: string; from: string; to: string; result: string }
const INITIAL: CurrencyState = { amount: "", from: "USD", to: "THB", result: "" };

export function CurrencyConverter() {
  const t = useTranslations("currency");
  const tc = useTranslations("common");
  const { value: state, setValue, reset } = useLocalStorage<CurrencyState>("sc_currency-converter_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    setLoadingRates(true);
    fetch("/api/rates")
      .then((r) => r.json())
      .then((data) => {
        if (data.rates) {
          setRates(data.rates);
          setRateDate(data.date ?? null);
          setRateError(!!data.fallback);
        }
      })
      .catch(() => setRateError(true))
      .finally(() => setLoadingRates(false));
  }, []);

  const CURRENCIES = Object.keys(rates).sort();

  const convert = () => {
    const v = parseFloat(state.amount);
    if (state.amount === "" || isNaN(v) || v <= 0) {
      setErrors({ amount: t("required_amount") });
      return;
    }
    setErrors({});
    const inUsd = v / (rates[state.from] ?? 1);
    const result = inUsd * (rates[state.to] ?? 1);
    setValue((s) => ({ ...s, result: result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) }));
    logCalculatorEvent("currency-converter", "app");
  };

  const swap = () => setValue((s) => ({ ...s, from: s.to, to: s.from, result: "" }));

  const crossRate = rates[state.from] && rates[state.to]
    ? (rates[state.to] / rates[state.from]).toFixed(4)
    : "—";

  return (
    <div className="calc-page-stack">
      <div className="calc-card">
        {/* Rate status */}
        <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${rateError ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400" : "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"}`}>
          <RefreshCw size={12} className={loadingRates ? "animate-spin" : ""} />
          {loadingRates
            ? t("loading_rates")
            : rateError
              ? t("approximate_rates")
              : rateDate
                ? t("live_rates_as_of", { date: rateDate })
                : t("live_rates")}
        </div>

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
            <CurrencySelect
              value={state.from}
              currencies={CURRENCIES}
              placeholder={t("search_currency")}
              onChange={(v) => setValue((s) => ({ ...s, from: v, result: "" }))}
            />
          </div>
          <button
            onClick={swap}
            className="mb-0.5 px-3 py-2.5 bg-(--muted) hover:bg-(--border) rounded-xl text-sm font-medium transition-colors"
            title={t("swap")}
          >⇄</button>
          <div>
            <label className="calc-label">{t("to")}</label>
            <CurrencySelect
              value={state.to}
              currencies={CURRENCIES}
              placeholder={t("search_currency")}
              onChange={(v) => setValue((s) => ({ ...s, to: v, result: "" }))}
            />
          </div>
        </div>

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
            1 {state.from} = {crossRate} {state.to}
          </p>
        </div>
      )}
    </div>
  );
}

function CurrencySelect({
  value,
  currencies,
  placeholder,
  onChange,
}: {
  value: string;
  currencies: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = currencies.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 0);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setSearch(""); }}
        className="calc-input flex items-center justify-between gap-2 cursor-pointer text-left"
      >
        <span className="font-semibold">{value}</span>
        <ChevronDown size={14} className={`shrink-0 text-(--muted-foreground) transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-(--card) border border-(--border) rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-(--border)">
            <Search size={13} className="shrink-0 text-(--muted-foreground)" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-(--muted-foreground)/60"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-(--muted-foreground) hover:text-foreground">
                <X size={12} />
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-(--muted-foreground) text-center">—</li>
            ) : (
              filtered.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-(--muted) transition-colors ${c === value ? "font-semibold text-indigo-600 dark:text-indigo-400 bg-(--muted)/60" : ""}`}
                  >
                    {c}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
