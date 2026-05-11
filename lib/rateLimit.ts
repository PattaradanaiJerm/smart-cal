/**
 * Simple in-memory rate limiter.
 * For single-instance deployments (Vercel serverless each invocation is isolated,
 * so this acts as a per-cold-start limiter — good enough to block naive spam).
 * For multi-instance scale, swap the Map for a Redis/KV store.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 5 * 60_000);
}

/**
 * Returns true if the request should be blocked.
 * @param key      — unique identifier (e.g. IP address)
 * @param limit    — max requests allowed in the window
 * @param windowMs — window size in milliseconds
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) return true;

  return false;
}

/**
 * Extract best-effort IP from Next.js request headers.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
