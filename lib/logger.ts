import { getSupabaseAdmin } from "./supabase";

export async function logPageView(data: {
  page: string;
  locale?: string;
  referrer?: string;
  user_agent?: string;
}) {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("page_views").insert(data);
  } catch {
    // Never throw — logging must not break the app
  }
}

export async function logCalculatorEvent(data: { slug: string; locale?: string }) {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("calculator_events").insert(data);
  } catch {
    //
  }
}

export async function logUIEvent(data: { event_name: string; payload?: Record<string, unknown> }) {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("ui_events").insert(data);
  } catch {
    //
  }
}

export async function logError(data: { type: string; path?: string; message?: string }) {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("error_logs").insert(data);
  } catch {
    //
  }
}
