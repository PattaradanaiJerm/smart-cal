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
      <div className="calc-card space-y-5">
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
            className="btn-primary flex-1"
          >
            {tc("calculate")}
          </button>
          <button
            onClick={reset}
            className="btn-secondary"
          >
            {tc("reset")}
          </button>
        </div>
      </div>

      {state.result !== null && (
      <div className="result-card">
          <p className="text-xs font-semibold text-(--muted-foreground) uppercase tracking-widest mb-2">{t("your_bmi")}</p>
          <p className="result-number mb-1">{state.result}</p>
          <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${
            state.result < 18.5 ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" :
            state.result < 25   ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" :
            state.result < 30   ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" :
                                  "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
          }`}>
            {getStatus(state.result).label}
          </span>
          {/* BMI bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs text-(--muted-foreground) font-medium">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
            <div className="h-2.5 bg-(--muted) rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-500 transition-all duration-500"
                style={{ width: `${Math.min((state.result / 40) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-(--muted-foreground)">
              <span>18.5</span><span>25</span><span>30</span><span>40+</span>
            </div>
          </div>
          <p className="text-xs text-(--muted-foreground) mt-4 leading-relaxed">{t("tip")}</p>
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
      <label className="calc-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="calc-input"
      />
    </div>
  );
}
