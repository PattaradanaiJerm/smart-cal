import { NextRequest, NextResponse } from "next/server";
import { logCalculatorEvent, logUIEvent } from "@/lib/logger";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // 30 calculator events per minute per IP
  if (isRateLimited(getClientIp(req), 30, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  try {
    const body = await req.json() as Record<string, unknown>;
    if (body.type === "ui") {
      await logUIEvent({ event_name: String(body.eventName), payload: body.payload as Record<string, unknown> });
    } else {
      await logCalculatorEvent({ slug: String(body.slug), locale: String(body.locale ?? "") });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
