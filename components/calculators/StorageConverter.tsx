"use client";

import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";

type Unit = "bit" | "byte" | "KB" | "MB" | "GB" | "TB" | "PB";

const UNIT_KEYS = ["unit_bit", "unit_byte", "unit_kb", "unit_mb", "unit_gb", "unit_tb", "unit_pb"] as const;

const UNIT_CONVERSIONS: { key: typeof UNIT_KEYS[number]; toBytes: (v: number) => number; fromBytes: (v: number) => number }[] = [
  { key: "unit_bit",  toBytes: (v) => v / 8,          fromBytes: (v) => v * 8 },
  { key: "unit_byte", toBytes: (v) => v,               fromBytes: (v) => v },
  { key: "unit_kb",   toBytes: (v) => v * 1024,        fromBytes: (v) => v / 1024 },
  { key: "unit_mb",   toBytes: (v) => v * 1024 ** 2,  fromBytes: (v) => v / 1024 ** 2 },
  { key: "unit_gb",   toBytes: (v) => v * 1024 ** 3,  fromBytes: (v) => v / 1024 ** 3 },
  { key: "unit_tb",   toBytes: (v) => v * 1024 ** 4,  fromBytes: (v) => v / 1024 ** 4 },
  { key: "unit_pb",   toBytes: (v) => v * 1024 ** 5,  fromBytes: (v) => v / 1024 ** 5 },
];

interface StorageState {
  fromIdx: number;
  toIdx: number;
  input: string;
  result: string;
}
const INITIAL: StorageState = { fromIdx: 3, toIdx: 4, input: "", result: "" };

function formatResult(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 0.001 && Math.abs(n) < 1e15) {
    return parseFloat(n.toPrecision(10)).toString();
  }
  return n.toExponential(4);
}

export function StorageConverter() {
  const t = useTranslations("storage");
  const tc = useTranslations("common");
  const { value: state, setValue, reset } = useLocalStorage<StorageState>("sc_storage-converter_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const convert = () => {
    const v = parseFloat(state.input);
    if (state.input === "" || isNaN(v) || v < 0) {
      setErrors({ input: t("required_value") });
      return;
    }
    setErrors({});
    const bytes = UNIT_CONVERSIONS[state.fromIdx].toBytes(v);
    const result = UNIT_CONVERSIONS[state.toIdx].fromBytes(bytes);
    setValue((s) => ({ ...s, result: formatResult(result) }));
    logCalculatorEvent("storage-converter", "app");
  };

  const swap = () => {
    setValue((s) => ({ ...s, fromIdx: s.toIdx, toIdx: s.fromIdx, result: "", input: s.result || s.input }));
  };

  const allResults: { label: string; value: string }[] | null =
    state.result !== "" && state.input !== ""
      ? (() => {
          const v = parseFloat(state.input);
          if (isNaN(v)) return null;
          const bytes = UNIT_CONVERSIONS[state.fromIdx].toBytes(v);
          return UNIT_CONVERSIONS.map((u) => ({
            label: t(u.key),
            value: formatResult(u.fromBytes(bytes)),
          }));
        })()
      : null;

  return (
    <div className="calc-page-stack">
      <div className="calc-card">
        <div>
          <label className="calc-label">{t("value_label")}</label>
          <input
            type="number"
            value={state.input}
            onChange={(e) => { setValue((s) => ({ ...s, input: e.target.value, result: "" })); setErrors({}); }}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            placeholder="0"
            className={`calc-input${errors.input ? " calc-input-error" : ""}`}
            autoFocus
          />
          {errors.input && <p className="field-error">⚠ {errors.input}</p>}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div>
            <label className="calc-label">{t("from_unit")}</label>
            <select
              value={state.fromIdx}
              onChange={(e) => setValue((s) => ({ ...s, fromIdx: +e.target.value, result: "" }))}
              className="calc-input"
            >
              {UNIT_CONVERSIONS.map((u, i) => (
                <option key={u.key} value={i}>{t(u.key)}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swap}
            className="mb-px p-2.5 rounded-xl border border-(--border) hover:bg-(--muted) transition-colors"
            title={t("swap_units")}
          >
            <ArrowRightLeft size={16} />
          </button>

          <div>
            <label className="calc-label">{t("to_unit")}</label>
            <select
              value={state.toIdx}
              onChange={(e) => setValue((s) => ({ ...s, toIdx: +e.target.value, result: "" }))}
              className="calc-input"
            >
              {UNIT_CONVERSIONS.map((u, i) => (
                <option key={u.key} value={i}>{t(u.key)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={convert} className="btn-primary flex-1">{tc("calculate")}</button>
          <button onClick={reset} className="btn-secondary">{tc("reset")}</button>
        </div>
      </div>

      {state.result !== "" && (
        <div className="result-card space-y-1">
          <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-widest mb-3">
            {tc("result")}
          </p>
          <p className="text-3xl font-bold mb-1">
            {state.result}{" "}
            <span className="text-lg font-medium text-(--muted-foreground)">
              {t(UNIT_CONVERSIONS[state.toIdx].key)}
            </span>
          </p>
        </div>
      )}

      {allResults && (
        <div className="result-card">
          <div className="space-y-0">
            {allResults.map((row, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-3 ${i !== allResults.length - 1 ? "border-b border-(--border)" : ""} ${i === state.toIdx ? "text-indigo-600 dark:text-indigo-400 font-semibold" : ""}`}
              >
                <span className="text-sm">{row.label}</span>
                <span className="text-sm font-mono">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

