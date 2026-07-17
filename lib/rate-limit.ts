// Simple in-memory fallback rate limiter for API routes
// Automatically switches to distributed mode when rate_limits table exists in Supabase

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

// In-memory fallback store (used when Supabase table doesn't exist yet)
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired in-memory entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of inMemoryStore.entries()) {
    if (value.resetAt < now) {
      inMemoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit check for API routes.
 * Uses Supabase as distributed store if available, falls back to in-memory.
 * Returns true if the request is allowed, false if rate limited.
 */
export async function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();

  // Try distributed rate limiting via Supabase
  try {
    const { supabaseAdmin } = await import("@/lib/supabase");

    // Check if rate_limits table exists first
    const { error: tableCheckError } = await supabaseAdmin
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (!tableCheckError) {
      // Table exists - use distributed rate limiting
      const windowStart = now - windowMs;

      // Insert a record for this request
      await supabaseAdmin.from("rate_limits").insert({
        identifier,
        created_at: new Date(now).toISOString(),
      });

      // Count requests in the current window
      const { count } = await supabaseAdmin
        .from("rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("identifier", identifier)
        .gte("created_at", new Date(windowStart).toISOString());

      const requestCount = count || 0;

      if (requestCount > maxRequests) {
        return { allowed: false, remaining: 0, resetAt: windowStart + windowMs };
      }

      return {
        allowed: true,
        remaining: maxRequests - requestCount,
        resetAt: windowStart + windowMs,
      };
    }
  } catch {
    // Table doesn't exist or error - fall through to in-memory fallback
  }

  // In-memory fallback (works without any database setup)
  const record = inMemoryStore.get(identifier);

  if (!record || record.resetAt < now) {
    // First request or window expired — create new window
    inMemoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (record.count >= maxRequests) {
    // Rate limited
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Increment count
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

/**
 * Clean up old rate limit records (call periodically, e.g., via cron)
 */
export async function cleanupRateLimits(): Promise<number> {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabaseAdmin
      .from("rate_limits")
      .delete()
      .lt("created_at", cutoff)
      .select("id");

    return data?.length || 0;
  } catch {
    return 0;
  }
}

/**
 * Get the IP address from a request (works with Vercel/Next.js)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}