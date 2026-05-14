import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isRateLimited, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // 5 messages per minute per IP to prevent spam
  if (isRateLimited(getClientIp(req), 5, 60_000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { topic, message, locale } = body as Record<string, string>;

    if (!topic || !message || message.trim().length < 5) {
      return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }

    if (message.trim().length > 2000) {
      return NextResponse.json({ ok: false, error: "message_too_long" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("contact_messages").insert({
      topic: topic.trim(),
      message: message.trim(),
      locale: locale ?? "th",
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
