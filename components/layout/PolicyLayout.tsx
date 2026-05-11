interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, subtitle, lastUpdated = "May 2026", children }: PolicyLayoutProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-linear-to-br from-indigo-500/10 to-purple-500/10 p-8 mb-8">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-(--muted-foreground) mb-3">{subtitle}</p>
        <span className="inline-flex items-center gap-1.5 text-xs bg-white/60 dark:bg-white/10 px-3 py-1 rounded-full text-(--muted-foreground)">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Last updated: {lastUpdated}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-(--border) bg-(--card) overflow-hidden">
      <div className="px-6 py-4 border-b border-(--border) bg-(--muted)/50">
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>
      <div className="px-6 py-5 text-sm leading-relaxed text-(--muted-foreground) space-y-3">
        {children}
      </div>
    </div>
  );
}
