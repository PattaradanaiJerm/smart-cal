import { NextRequest, NextResponse } from "next/server";
import { logPageView } from "@/lib/logger";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // 60 page-view pings per minute per IP
  if (isRateLimited(getClientIp(req), 60, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  try {
    const body = await req.json();
    const { page, locale, referrer } = body as Record<string, string>;
    const userAgent = req.headers.get("user-agent") ?? undefined;
    await logPageView({ page, locale, referrer, user_agent: userAgent });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
