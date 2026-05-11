"use client";

import { useTranslations, useLocale } from "next-intl";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Plus, Trash2 } from "lucide-react";

const GRADES = ["A", "B+", "B", "C+", "C", "D+", "D", "F"];
const GRADE_POINTS: Record<string, number> = { A: 4.0, "B+": 3.5, B: 3.0, "C+": 2.5, C: 2.0, "D+": 1.5, D: 1.0, F: 0.0 };

interface Course { name: string; credits: string; grade: string }
interface GPAState {
  courses: Course[];
  prevGpa: string;
  prevCredits: string;
  result: { semGpa: number; totalCredits: number; cumGpa: number | null } | null;
}

const INITIAL: GPAState = {
  courses: [{ name: "", credits: "3", grade: "A" }],
  prevGpa: "", prevCredits: "",
  result: null,
};

export function GpaCalculator() {
  const t = useTranslations("gpa");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { value: state, setValue, reset } = useLocalStorage<GPAState>("sc_gpa-calculator_state", INITIAL);
  const { logCalculatorEvent } = useAnalytics();

  const calculate = () => {
    const validCourses = state.courses.filter((c) => parseFloat(c.credits) > 0);
    if (!validCourses.length) return;

    let totalPoints = 0, totalCreds = 0;
    for (const c of validCourses) {
      const cr = parseFloat(c.credits);
      totalPoints += cr * (GRADE_POINTS[c.grade] ?? 0);
      totalCreds += cr;
    }
    const semGpa = totalCreds > 0 ? totalPoints / totalCreds : 0;

    let cumGpa: number | null = null;
    const prevG = parseFloat(state.prevGpa);
    const prevC = parseFloat(state.prevCredits);
    if (!isNaN(prevG) && !isNaN(prevC) && prevC > 0) {
      cumGpa = (totalPoints + prevG * prevC) / (totalCreds + prevC);
    }

    setValue((s) => ({ ...s, result: { semGpa: Math.round(semGpa * 100) / 100, totalCredits: totalCreds, cumGpa: cumGpa !== null ? Math.round(cumGpa * 100) / 100 : null } }));
    logCalculatorEvent("gpa-calculator", locale);
  };

  const addCourse = () => setValue((s) => ({ ...s, courses: [...s.courses, { name: "", credits: "3", grade: "A" }], result: null }));
  const removeCourse = (i: number) => setValue((s) => ({ ...s, courses: s.courses.filter((_, idx) => idx !== i), result: null }));
  const updateCourse = (i: number, field: keyof Course, val: string) =>
    setValue((s) => ({ ...s, courses: s.courses.map((c, idx) => idx === i ? { ...c, [field]: val } : c), result: null }));

  return (
    <div className="space-y-4">
      <div className="calc-card space-y-4">
        {state.courses.map((course, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_80px_36px] gap-2 items-end">
            <div>
              {i === 0 && <label className="calc-label">{t("course_name")}</label>}
              <input value={course.name} onChange={(e) => updateCourse(i, "name", e.target.value)} placeholder={`${t("course_name")} ${i + 1}`}
                className="calc-input" />
            </div>
            <div>
              {i === 0 && <label className="calc-label">{t("credits")}</label>}
              <input type="number" value={course.credits} onChange={(e) => updateCourse(i, "credits", e.target.value)} min="1" max="6"
                className="calc-input" />
            </div>
            <div>
              {i === 0 && <label className="calc-label">{t("grade")}</label>}
              <select value={course.grade} onChange={(e) => updateCourse(i, "grade", e.target.value)}
                className="calc-input">
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <button onClick={() => removeCourse(i)} disabled={state.courses.length === 1}
              className="py-2 px-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 disabled:opacity-30 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button onClick={addCourse} className="w-full py-2 border border-dashed border-(--border) rounded-xl text-sm text-(--muted-foreground) hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1">
          <Plus size={14} /> {t("add_course")}
        </button>

        {/* Previous GPA */}
        <div className="pt-2 border-t border-(--border) grid grid-cols-2 gap-3">
          <div>
            <label className="calc-label">{t("prev_gpa")}</label>
            <input type="number" value={state.prevGpa} step="0.01" min="0" max="4" onChange={(e) => setValue((s) => ({ ...s, prevGpa: e.target.value, result: null }))} placeholder="3.50"
              className="calc-input" />
          </div>
          <div>
            <label className="calc-label">{t("prev_credits")}</label>
            <input type="number" value={state.prevCredits} onChange={(e) => setValue((s) => ({ ...s, prevCredits: e.target.value, result: null }))} placeholder="60"
              className="calc-input" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={calculate} className="btn-primary flex-1">{tc("calculate")}</button>
          <button onClick={reset} className="btn-secondary">{tc("reset")}</button>
        </div>
      </div>

      {state.result && (
        <div className="result-card space-y-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-indigo-50 dark:bg-indigo-950/40 rounded-xl p-4">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{state.result.semGpa.toFixed(2)}</p>
              <p className="text-xs text-(--muted-foreground) mt-1">{t("semester_gpa")}</p>
            </div>
            <div className="text-center bg-(--muted) rounded-xl p-4">
              <p className="text-3xl font-bold">{state.result.totalCredits}</p>
              <p className="text-xs text-(--muted-foreground) mt-1">{t("credits_total")}</p>
            </div>
          </div>
          {state.result.cumGpa !== null && (
            <div className="text-center border border-(--border) rounded-xl p-4">
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{state.result.cumGpa.toFixed(2)}</p>
              <p className="text-sm text-(--muted-foreground) mt-1">{t("cumulative_gpa")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
