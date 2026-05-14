import { Calculator, Ruler, Scale, Clock, TrendingUp, Percent, Flame, Calendar, Moon, GraduationCap, Hash, RotateCw, Layers, HardDrive } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CalculatorConfig {
  slug: string;
  icon: LucideIcon;
  nameKey: string; // key in messages/nav
  titleKey: string; // key in messages
  descKey: string;
  cardDescKey: string; // key in messages/cards
  color: string; // tailwind bg class
}

export const calculators: CalculatorConfig[] = [
  {
    slug: "unit-converter",
    icon: Ruler,
    nameKey: "unit_converter",
    titleKey: "unit.title",
    descKey: "unit.description",
    cardDescKey: "unit_converter",
    color: "bg-blue-500",
  },
  {
    slug: "bmi",
    icon: Scale,
    nameKey: "bmi",
    titleKey: "bmi.title",
    descKey: "bmi.description",
    cardDescKey: "bmi",
    color: "bg-green-500",
  },
  {
    slug: "age-calculator",
    icon: Clock,
    nameKey: "age_calculator",
    titleKey: "age.title",
    descKey: "age.description",
    cardDescKey: "age_calculator",
    color: "bg-purple-500",
  },
  {
    slug: "currency-converter",
    icon: TrendingUp,
    nameKey: "currency_converter",
    titleKey: "currency.title",
    descKey: "currency.description",
    cardDescKey: "currency_converter",
    color: "bg-yellow-500",
  },
  {
    slug: "loan-calculator",
    icon: Calculator,
    nameKey: "loan_calculator",
    titleKey: "loan.title",
    descKey: "loan.description",
    cardDescKey: "loan_calculator",
    color: "bg-red-500",
  },
  {
    slug: "percentage-calculator",
    icon: Percent,
    nameKey: "percentage_calculator",
    titleKey: "percentage.title",
    descKey: "percentage.description",
    cardDescKey: "percentage_calculator",
    color: "bg-orange-500",
  },
  {
    slug: "calorie-calculator",
    icon: Flame,
    nameKey: "calorie_calculator",
    titleKey: "calorie.title",
    descKey: "calorie.description",
    cardDescKey: "calorie_calculator",
    color: "bg-pink-500",
  },
  {
    slug: "date-calculator",
    icon: Calendar,
    nameKey: "date_calculator",
    titleKey: "date.title",
    descKey: "date.description",
    cardDescKey: "date_calculator",
    color: "bg-indigo-500",
  },
  {
    slug: "sleep-calculator",
    icon: Moon,
    nameKey: "sleep_calculator",
    titleKey: "sleep.title",
    descKey: "sleep.description",
    cardDescKey: "sleep_calculator",
    color: "bg-violet-500",
  },
  {
    slug: "gpa-calculator",
    icon: GraduationCap,
    nameKey: "gpa_calculator",
    titleKey: "gpa.title",
    descKey: "gpa.description",
    cardDescKey: "gpa_calculator",
    color: "bg-teal-500",
  },
  {
    slug: "random-number",
    icon: Hash,
    nameKey: "random_number",
    titleKey: "random_number.title",
    descKey: "random_number.description",
    cardDescKey: "random_number",
    color: "bg-cyan-500",
  },
  {
    slug: "spin-wheel",
    icon: RotateCw,
    nameKey: "spin_wheel",
    titleKey: "spin_wheel.title",
    descKey: "spin_wheel.description",
    cardDescKey: "spin_wheel",
    color: "bg-fuchsia-500",
  },
  {
    slug: "card-draw",
    icon: Layers,
    nameKey: "card_draw",
    titleKey: "card_draw.title",
    descKey: "card_draw.description",
    cardDescKey: "card_draw",
    color: "bg-amber-500",
  },
  {
    slug: "storage-converter",
    icon: HardDrive,
    nameKey: "storage_converter",
    titleKey: "storage.title",
    descKey: "storage.description",
    cardDescKey: "storage_converter",
    color: "bg-teal-500",
  },
];
