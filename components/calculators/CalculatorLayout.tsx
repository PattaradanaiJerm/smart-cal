import { AdUnit } from "@/components/ads/AdUnit";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

const colorMap: Record<string, { grad: string; glow: string }> = {
  indigo: { grad: "from-blue-500 to-cyan-500",     glow: "rgba(59,130,246,0.22)" },
  blue:   { grad: "from-blue-500 to-cyan-500",     glow: "rgba(59,130,246,0.20)" },
  green:  { grad: "from-emerald-500 to-teal-500",  glow: "rgba(16,185,129,0.20)" },
  orange: { grad: "from-orange-500 to-amber-500",  glow: "rgba(249,115,22,0.20)" },
  pink:   { grad: "from-pink-500 to-rose-500",     glow: "rgba(236,72,153,0.20)" },
  teal:   { grad: "from-teal-500 to-cyan-500",     glow: "rgba(20,184,166,0.20)" },
};

export function CalculatorLayout({ title, description, children, icon, color = "indigo" }: CalculatorLayoutProps) {
  const c = colorMap[color] ?? colorMap.indigo;
  const iconClass = `flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl text-3xl bg-gradient-to-br ${c.grad} shadow-lg`;
  const backdropClass = `absolute inset-0 bg-gradient-to-br ${c.grad} opacity-10 dark:opacity-20`;
  const accentClass = `h-0.5 bg-gradient-to-r ${c.grad} opacity-40`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Hero header ── */}
      <div className="relative mb-6 rounded-2xl overflow-hidden border border-(--border)" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className={backdropClass} />
        <div className="relative z-10 flex items-start gap-4 p-6">
          {icon && (
            <div className={iconClass} style={{ boxShadow: `0 8px 24px ${c.glow}` }}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0 pt-1">
            <h1 className="text-2xl font-bold tracking-tight mb-1.5">{title}</h1>
            <p className="text-sm text-(--muted-foreground) leading-relaxed">{description}</p>
          </div>
        </div>
        <div className={accentClass} />
      </div>

      {/* ── In-content ad ── */}
      <div className="mb-5">
        <AdUnit
          slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT_TOP ?? "in-content-top"}
          className="h-24 w-full"
          format="horizontal"
        />
      </div>

      {/* ── Calculator content ── */}
      {children}
    </div>
  );
}
