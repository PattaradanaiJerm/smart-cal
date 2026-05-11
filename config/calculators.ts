import { Calculator, Ruler, Scale, Clock, TrendingUp, Percent, Flame, Calendar, Moon, GraduationCap, Hash, RotateCw, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CalculatorConfig {
  slug: string;
  icon: LucideIcon;
  nameKey: string; // key in messages/nav
  titleKey: string; // key in messages
  descKey: string;
  color: string; // tailwind bg class
  descTh: string;
  descEn: string;
}

export const calculators: CalculatorConfig[] = [
  {
    slug: "unit-converter",
    icon: Ruler,
    nameKey: "unit_converter",
    titleKey: "unit.title",
    descKey: "unit.description",
    color: "bg-blue-500",
    descTh: "แปลงหน่วยความยาว น้ำหนัก อุณหภูมิ และอื่นๆ",
    descEn: "Convert length, weight, temperature and more",
  },
  {
    slug: "bmi",
    icon: Scale,
    nameKey: "bmi",
    titleKey: "bmi.title",
    descKey: "bmi.description",
    color: "bg-green-500",
    descTh: "คำนวณดัชนีมวลกาย (BMI) และตรวจสอบสุขภาพ",
    descEn: "Calculate Body Mass Index and check your health",
  },
  {
    slug: "age-calculator",
    icon: Clock,
    nameKey: "age_calculator",
    titleKey: "age.title",
    descKey: "age.description",
    color: "bg-purple-500",
    descTh: "คำนวณอายุที่แน่นอนจากวันเกิดเป็นปี เดือน วัน",
    descEn: "Calculate exact age in years, months and days",
  },
  {
    slug: "currency-converter",
    icon: TrendingUp,
    nameKey: "currency_converter",
    titleKey: "currency.title",
    descKey: "currency.description",
    color: "bg-yellow-500",
    descTh: "แปลงสกุลเงินทั่วโลก อัตราแลกเปลี่ยนล่าสุด",
    descEn: "Convert world currencies with live exchange rates",
  },
  {
    slug: "loan-calculator",
    icon: Calculator,
    nameKey: "loan_calculator",
    titleKey: "loan.title",
    descKey: "loan.description",
    color: "bg-red-500",
    descTh: "คำนวณค่างวดสินเชื่อ ดอกเบี้ย และยอดรวมที่ต้องชำระ",
    descEn: "Calculate loan payments, interest and total cost",
  },
  {
    slug: "percentage-calculator",
    icon: Percent,
    nameKey: "percentage_calculator",
    titleKey: "percentage.title",
    descKey: "percentage.description",
    color: "bg-orange-500",
    descTh: "คำนวณเปอร์เซ็นต์ การเปลี่ยนแปลง และส่วนลด",
    descEn: "Calculate percentages, changes and discounts",
  },
  {
    slug: "calorie-calculator",
    icon: Flame,
    nameKey: "calorie_calculator",
    titleKey: "calorie.title",
    descKey: "calorie.description",
    color: "bg-pink-500",
    descTh: "คำนวณความต้องการแคลอรี่ต่อวัน (TDEE) ตามกิจกรรม",
    descEn: "Calculate daily calorie needs (TDEE) by activity level",
  },
  {
    slug: "date-calculator",
    icon: Calendar,
    nameKey: "date_calculator",
    titleKey: "date.title",
    descKey: "date.description",
    color: "bg-indigo-500",
    descTh: "คำนวณจำนวนวันระหว่างสองวันที่ หรือบวก/ลบวัน",
    descEn: "Calculate days between dates or add/subtract days",
  },
  {
    slug: "sleep-calculator",
    icon: Moon,
    nameKey: "sleep_calculator",
    titleKey: "sleep.title",
    descKey: "sleep.description",
    color: "bg-violet-500",
    descTh: "คำนวณเวลาตื่นนอนที่เหมาะสมตามรอบ Sleep Cycle",
    descEn: "Find ideal wake-up times based on sleep cycles",
  },
  {
    slug: "gpa-calculator",
    icon: GraduationCap,
    nameKey: "gpa_calculator",
    titleKey: "gpa.title",
    descKey: "gpa.description",
    color: "bg-teal-500",
    descTh: "คำนวณ GPA สะสมและ GPA เทอมปัจจุบัน",
    descEn: "Calculate cumulative GPA and semester GPA",
  },
  {
    slug: "random-number",
    icon: Hash,
    nameKey: "random_number",
    titleKey: "random_number.title",
    descKey: "random_number.description",
    color: "bg-cyan-500",
    descTh: "สุ่มตัวเลขในช่วงที่กำหนด จำนวนหลายตัวได้",
    descEn: "Generate random numbers in any range",
  },
  {
    slug: "spin-wheel",
    icon: RotateCw,
    nameKey: "spin_wheel",
    titleKey: "spin_wheel.title",
    descKey: "spin_wheel.description",
    color: "bg-fuchsia-500",
    descTh: "วงล้อสุ่มแบบกำหนดเองได้ ใส่ตัวเลือกเองได้เลย",
    descEn: "Custom spin wheel with your own options",
  },
  {
    slug: "card-draw",
    icon: Layers,
    nameKey: "card_draw",
    titleKey: "card_draw.title",
    descKey: "card_draw.description",
    color: "bg-amber-500",
    descTh: "สุ่มจั่วการ์ดจากรายการที่กำหนดเอง",
    descEn: "Draw random cards from your custom list",
  },
];
