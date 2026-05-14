import { NextResponse } from "next/server";

// Fetches live rates from frankfurter.app (free, no API key, open-source)
// Revalidates every hour via Next.js fetch cache
export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?base=USD", {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const data = await res.json() as { base: string; date: string; rates: Record<string, number> };

    // Ensure USD itself is in the map (frankfurter omits base currency)
    const rates: Record<string, number> = { USD: 1, ...data.rates };

    return NextResponse.json({ rates, date: data.date }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch {
    // Fallback to static rates so the converter still works offline
    return NextResponse.json({
      rates: {
        USD: 1, EUR: 0.925, GBP: 0.79, JPY: 144.5,
        THB: 34.5, CNY: 7.25, SGD: 1.35, MYR: 4.7,
        HKD: 7.82, AUD: 1.55, CAD: 1.38, CHF: 0.9,
      },
      date: null,
      fallback: true,
    });
  }
}
