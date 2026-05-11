import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Cache response for 5 minutes to avoid hitting Supabase on every request
export const revalidate = 300;

export async function GET() {
  try {
    const admin = getSupabaseAdmin();

    const [pvRes, calcRes] = await Promise.all([
      admin.from("page_views").select("*", { count: "exact", head: true }),
      admin.from("calculator_events").select("*", { count: "exact", head: true }),
    ]);

    return NextResponse.json(
      {
        totalPageViews: pvRes.count ?? 0,
        totalCalculations: calcRes.count ?? 0,
      },
      {
        headers: {
          // Public cache: CDN caches 5 min, stale-while-revalidate 1 min
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    // If Supabase not configured, return zeros gracefully
    return NextResponse.json(
      { totalPageViews: 0, totalCalculations: 0 },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  }
}
