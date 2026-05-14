"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const PATCHES: {
  version: string;
  date: { th: string; en: string };
  title: { th: string; en: string };
  tag: string;
  tagColor: string;
  changes: { th: string[]; en: string[] };
}[] = [
  {
    version: "1.2",
    date: { th: "พฤษภาคม 2026", en: "May 2026" },
    title: { th: "เพิ่มการแปลงความจุ", en: "Storage Converter" },
    tag: "new",
    tagColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    changes: {
      th: [
        "เพิ่มเครื่องมือแปลงความจุข้อมูล (Storage Converter)",
        "รองรับ Bit, Byte, KB, MB, GB, TB, PB",
        "แปลงสองทิศทาง พร้อมตารางเทียบทุกหน่วยในครั้งเดียว",
        "อัปเกรดแปลงสกุลเงินเป็น Real-time ผ่าน frankfurter.app (อัปเดตทุก 1 ชั่วโมง)",
        "แก้ไข Hydration Error ใน CalculatorLayout",
        "แก้ไขปัญหา Hydration ใน useLocalStorage",
        "เพิ่มระยะห่างตัวอักษรทั่วโปรเจ็คให้อ่านง่ายขึ้น",
        "ลบสัญลักษณ์ไพ่ออกจากหน้าจั่วการ์ด",
      ],
      en: [
        "New tool: Storage Converter (Bit, Byte, KB, MB, GB, TB, PB)",
        "Bidirectional conversion with full-unit comparison table",
        "Upgraded Currency Converter to real-time rates via frankfurter.app (hourly updates)",
        "Fixed Hydration Error in CalculatorLayout",
        "Fixed useLocalStorage hydration mismatch on page load",
        "Increased letter spacing across the project for readability",
        "Removed card suit symbols from Card Draw results",
      ],
    },
  },
  {
    version: "1.1",
    date: { th: "มีนาคม 2026", en: "March 2026" },
    title: { th: "ปรับปรุงความเสถียร", en: "Stability Optimizations" },
    tag: "improve",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    changes: {
      th: [
        "ปรับปรุงประสิทธิภาพการโหลดหน้าทุกเครื่องมือ",
        "เพิ่ม Rate Limiting สำหรับ API ทั้งหมด",
        "เพิ่มระบบ Analytics และบันทึก Calculator Events",
        "เพิ่มรองรับ 2 ภาษา (ไทย / อังกฤษ) ทั่วทั้งแอป",
        "เพิ่มหน้า Admin Dashboard สำหรับดู Analytics",
        "เพิ่มระบบ Announcements",
        "เพิ่ม Cookie Consent Banner",
      ],
      en: [
        "Improved page load performance for all tools",
        "Added Rate Limiting to all API routes",
        "Added Analytics logging and Calculator Event tracking",
        "Full bilingual support (Thai / English) across the app",
        "Added Admin Dashboard for Analytics",
        "Added Announcements system",
        "Added Cookie Consent Banner",
      ],
    },
  },
  {
    version: "1.0",
    date: { th: "มกราคม 2026", en: "January 2026" },
    title: { th: "เปิดตัว D-Calc", en: "Initial Launch" },
    tag: "launch",
    tagColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    changes: {
      th: [
        "เปิดตัว D-Calc — รวมเครื่องคำนวณออนไลน์ฟรี",
        "เครื่องคำนวณ BMI, แคลอรี่, GPA, สินเชื่อ, เปอร์เซ็นต์",
        "คำนวณอายุและคำนวณวันที่",
        "คำนวณการนอน (Sleep Cycle)",
        "แปลงสกุลเงิน และแปลงหน่วย",
        "สุ่มตัวเลข, วงล้อสุ่ม, สุ่มจั่วการ์ด",
        "รองรับ Dark Mode",
      ],
      en: [
        "Launched D-Calc — free online calculator hub",
        "BMI, Calorie, GPA, Loan, Percentage calculators",
        "Age Calculator and Date Calculator",
        "Sleep Cycle Calculator",
        "Currency Converter and Unit Converter",
        "Random Number, Spin Wheel, Card Draw",
        "Dark Mode support",
      ],
    },
  },
];

interface PatchNotesModalProps {
  open: boolean;
  onClose: () => void;
}

export function PatchNotesModal({ open, onClose }: PatchNotesModalProps) {
  const locale = useLocale();
  const isTh = locale === "th";
  const tp = useTranslations("patch_notes");

  const [activeVersion, setActiveVersion] = useState(PATCHES[0].version);
  const activePatch = PATCHES.find((p) => p.version === activeVersion) ?? PATCHES[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (open) setActiveVersion(PATCHES[0].version);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full max-w-2xl bg-(--card) rounded-2xl shadow-2xl border border-(--border) flex flex-col h-[520px] max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border) shrink-0">
          <div>
            <h2 className="font-bold text-base">{tp("title")}</h2>
            <p className="text-xs text-(--muted-foreground) mt-0.5">
              {tp("subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-(--muted) text-(--muted-foreground) hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Left nav — scrollable */}
          <nav className="w-24 shrink-0 border-r border-(--border) py-2 flex flex-col overflow-y-auto">
            {PATCHES.map((patch) => {
              const isActive = activeVersion === patch.version;
              return (
                <button
                  key={patch.version}
                  onClick={() => setActiveVersion(patch.version)}
                  className={cn(
                    "flex flex-col items-start px-3 py-3 text-left transition-all border-l-2",
                    isActive
                      ? "bg-(--muted) border-indigo-500"
                      : "border-transparent hover:bg-(--muted)/50 text-(--muted-foreground)"
                  )}
                >
                  <span className={cn(
                    "font-mono text-sm font-semibold tracking-tight",
                    isActive ? "text-foreground" : "text-(--muted-foreground)"
                  )}>
                    v{patch.version}
                  </span>
                  <span className="text-[10px] text-(--muted-foreground) mt-0.5 leading-tight">
                    {isTh ? patch.date.th : patch.date.en}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right content — only active patch */}
          <div className="flex-1 overflow-y-auto min-w-0">
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-(--muted-foreground)">v{activePatch.version}</span>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide", activePatch.tagColor)}>
                      {activePatch.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight">
                    {isTh ? activePatch.title.th : activePatch.title.en}
                  </h3>
                </div>
                <span className="text-xs text-(--muted-foreground) shrink-0 mt-1">
                  {isTh ? activePatch.date.th : activePatch.date.en}
                </span>
              </div>

              <ul className="space-y-2.5">
                {(isTh ? activePatch.changes.th : activePatch.changes.en).map((change, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-(--muted-foreground) leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--muted-foreground)/40 shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
