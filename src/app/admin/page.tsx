import { getSupabaseAdmin } from "@/lib/supabase";

async function getStats() {
  const admin = getSupabaseAdmin();
  const since = new Date(Date.now() - 7 * 86400000).toISOString();

  const [pvRes, calcRes, errRes] = await Promise.all([
    admin.from("page_views").select("page", { count: "exact" }).gte("created_at", since),
    admin.from("calculator_events").select("slug").gte("created_at", since),
    admin.from("error_logs").select("type", { count: "exact" }).gte("created_at", since),
  ]);

  // top pages
  const pageCounts: Record<string, number> = {};
  for (const r of pvRes.data ?? []) {
    pageCounts[r.page] = (pageCounts[r.page] ?? 0) + 1;
  }
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // top calcs
  const calcCounts: Record<string, number> = {};
  for (const r of calcRes.data ?? []) {
    calcCounts[r.slug] = (calcCounts[r.slug] ?? 0) + 1;
  }
  const topCalcs = Object.entries(calcCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return {
    totalPageViews: pvRes.count ?? 0,
    totalErrors: errRes.count ?? 0,
    topPages,
    topCalcs,
  };
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Dashboard — Last 7 Days</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Page Views" value={stats.totalPageViews} color="text-indigo-600" />
        <StatCard title="Errors" value={stats.totalErrors} color="text-red-500" />
        <StatCard title="Calculators" value={10} color="text-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-(--card) border border-(--border) rounded-xl p-5">
          <h2 className="font-bold mb-4">Top Pages</h2>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-(--muted-foreground)">No data yet</p>
          ) : (
            <ul className="space-y-2">
              {stats.topPages.map(([page, count]) => (
                <li key={page} className="flex justify-between text-sm">
                  <span className="truncate text-(--muted-foreground)">{page || "/"}</span>
                  <span className="font-semibold ml-4">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Calculators */}
        <div className="bg-(--card) border border-(--border) rounded-xl p-5">
          <h2 className="font-bold mb-4">Top Calculators</h2>
          {stats.topCalcs.length === 0 ? (
            <p className="text-sm text-(--muted-foreground)">No data yet</p>
          ) : (
            <ul className="space-y-2">
              {stats.topCalcs.map(([slug, count]) => (
                <li key={slug} className="flex justify-between text-sm">
                  <span className="text-(--muted-foreground)">{slug}</span>
                  <span className="font-semibold ml-4">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="bg-(--card) border border-(--border) rounded-xl p-5">
      <p className="text-sm text-(--muted-foreground) mb-1">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}
