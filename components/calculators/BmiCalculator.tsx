"use client";

import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLocale } from "next-intl";

interface BMIState {
  weight: string;
  height: string;
  result: number | null;
}

const INITIAL: BMIState = { weight: "", height: "", result: null };

export function BmiCalculator() {
  const t = useTranslations("bmi");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<BMIState>("sc_bmi_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const calculate = () => {
    const w = parseFloat(state.weight);
    const h = parseFloat(state.height) / 100;
    if (!w || !h || h <= 0) return;
    const bmi = w / (h * h);
    setValue((s) => ({ ...s, result: Math.round(bmi * 10) / 10 }));
    logCalculatorEvent("bmi", locale);
  };

  const getStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: t("status_underweight"), color: "text-blue-500" };
    if (bmi < 25) return { label: t("status_normal"), color: "text-green-500" };
    if (bmi < 30) return { label: t("status_overweight"), color: "text-yellow-500" };
    return { label: t("status_obese"), color: "text-red-500" };
  };

  return (
    <div className="space-y-4">
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4">
        <Field
          label={`${t("weight")} (${t("weight_unit")})`}
          value={state.weight}
          onChange={(v) => setValue((s) => ({ ...s, weight: v, result: null }))}
          placeholder="70"
          type="number"
        />
        <Field
          label={`${t("height")} (${t("height_unit")})`}
          value={state.height}
          onChange={(v) => setValue((s) => ({ ...s, height: v, result: null }))}
          placeholder="170"
          type="number"
        />
        <div className="flex gap-3 pt-2">
          <button
            onClick={calculate}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {tc("calculate")}
          </button>
          <button
            onClick={reset}
            className="px-4 bg-(--muted) hover:bg-(--border) rounded-xl transition-colors text-sm"
          >
            {tc("reset")}
          </button>
        </div>
      </div>

      {state.result !== null && (
        <div className="result-card bg-(--card) border border-(--border) rounded-2xl p-6">
          <p className="text-sm text-(--muted-foreground) mb-1">{t("your_bmi")}</p>
          <p className="text-5xl font-bold mb-2">{state.result}</p>
          <p className={`text-lg font-semibold ${getStatus(state.result).color}`}>
            {getStatus(state.result).label}
          </p>
          <div className="mt-4 h-3 bg-(--muted) rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-400 via-yellow-400 to-red-500 rounded-full"
              style={{ width: `${Math.min((state.result / 40) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-(--muted-foreground) mt-3">{t("tip")}</p>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-(--muted) border border-(--border) rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-colors"
      />
    </div>
  );
}
