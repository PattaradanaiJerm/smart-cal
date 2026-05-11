import { getSupabaseAdmin } from "@/lib/supabase";

export default async function AnalyticsPage() {
  const admin = getSupabaseAdmin();

  const { data: calcEvents } = await admin
    .from("calculator_events")
    .select("slug, locale, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: errors } = await admin
    .from("error_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // Group calculator events by slug
  const bySlog: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  for (const e of calcEvents ?? []) {
    bySlog[e.slug] = (bySlog[e.slug] ?? 0) + 1;
    byLocale[e.locale ?? "unknown"] = (byLocale[e.locale ?? "unknown"] ?? 0) + 1;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Calculator usage */}
      <div className="bg-(--card) border border-(--border) rounded-xl p-6">
        <h2 className="font-bold mb-4 text-lg">Calculator Usage (All Time)</h2>
        <div className="space-y-3">
          {Object.entries(bySlog).sort((a, b) => b[1] - a[1]).map(([slug, count]) => {
            const max = Math.max(...Object.values(bySlog));
            return (
              <div key={slug} className="flex items-center gap-3">
                <span className="w-40 text-sm text-(--muted-foreground) truncate">{slug}</span>
                <div className="flex-1 bg-(--muted) rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                </div>
                <span className="text-sm font-semibold w-10 text-right">{count}</span>
              </div>
            );
          })}
          {!Object.keys(bySlog).length && <p className="text-sm text-(--muted-foreground)">No data yet</p>}
        </div>
      </div>

      {/* Language distribution */}
      <div className="bg-(--card) border border-(--border) rounded-xl p-6">
        <h2 className="font-bold mb-4 text-lg">Language Distribution</h2>
        <div className="flex gap-6">
          {Object.entries(byLocale).map(([locale, count]) => (
            <div key={locale} className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{count}</p>
              <p className="text-sm text-(--muted-foreground) mt-1 uppercase">{locale}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent errors */}
      <div className="bg-(--card) border border-(--border) rounded-xl p-6">
        <h2 className="font-bold mb-4 text-lg">Recent Errors</h2>
        {!errors?.length ? (
          <p className="text-sm text-(--muted-foreground)">No errors 🎉</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-(--muted-foreground) border-b border-(--border)">
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Path</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((e) => (
                  <tr key={e.id} className="border-b border-(--border) last:border-0">
                    <td className="py-2 pr-4 font-mono text-red-500">{e.type}</td>
                    <td className="py-2 pr-4 text-(--muted-foreground)">{e.path}</td>
                    <td className="py-2 text-(--muted-foreground)">
                      {new Date(e.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
