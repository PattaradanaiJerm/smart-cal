import { AdUnit } from "@/components/ads/AdUnit";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

export function CalculatorLayout({ title, description, children, icon, color = "indigo" }: CalculatorLayoutProps) {
  const gradients: Record<string, string> = {
    indigo: "from-indigo-500/10 to-purple-500/10 border-indigo-100 dark:border-indigo-900/40",
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-100 dark:border-blue-900/40",
    green: "from-green-500/10 to-emerald-500/10 border-green-100 dark:border-green-900/40",
    orange: "from-orange-500/10 to-yellow-500/10 border-orange-100 dark:border-orange-900/40",
    pink: "from-pink-500/10 to-rose-500/10 border-pink-100 dark:border-pink-900/40",
    teal: "from-teal-500/10 to-cyan-500/10 border-teal-100 dark:border-teal-900/40",
  };

  const gradient = gradients[color] ?? gradients.indigo;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className={`rounded-2xl border bg-linear-to-br ${gradient} p-6 mb-6`}>
        {icon && <div className="mb-3 text-4xl">{icon}</div>}
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-(--muted-foreground) text-sm">{description}</p>
      </div>

      {/* In-content ad — between header and calculator */}
      <div className="mb-4">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT_TOP ?? "in-content-top"}
          className="h-24 w-full"
          format="horizontal"
        />
      </div>

      {children}
    </div>
  );
}

