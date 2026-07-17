import { supabaseAdmin } from "@/lib/supabase";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

/**
 * Distributed rate limit check using Supabase as the backend store.
 * Works across multiple serverless instances.
 * Returns true if the request is allowed, false if rate limited.
 */
export async function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    // Use Supabase as distributed store - insert a record for this request
    // We use a dedicated table for rate limiting
    const { error: insertError } = await supabaseAdmin
      .from("rate_limits")
      .insert({
        identifier,
        created_at: new Date(now).toISOString(),
      });

    if (insertError) {
      // Fallback: if table doesn't exist or error, allow the request
      console.warn("[rate-limit] Supabase insert failed, allowing request:", insertError.message);
      return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
    }

    // Count requests in the current window
    const countQuery = await supabaseAdmin
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("identifier", identifier)
      .gte("created_at", new Date(windowStart).toISOString());

    const { count, error: countError } = countQuery;

    if (countError) {
      console.warn("[rate-limit] Count query failed, allowing request:", countError.message);
      return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
    }

    const requestCount = count || 0;

    if (requestCount > maxRequests) {
      // Rate limited - calculate when the window resets
      return {
        allowed: false,
        remaining: 0,
        resetAt: windowStart + windowMs,
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - requestCount,
      resetAt: windowStart + windowMs,
    };
  } catch (err) {
    // In case of any error, allow the request to not block legitimate users
    console.warn("[rate-limit] Unexpected error, allowing request:", err);
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
}

/**
 * Clean up old rate limit records (call periodically, e.g., via cron)
 */
export async function cleanupRateLimits(): Promise<number> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago
  const { data, error } = await supabaseAdmin
    .from("rate_limits")
    .delete()
    .lt("created_at", cutoff)
    .select("id");

  if (error) {
    console.error("[rate-limit] Cleanup error:", error.message);
    return 0;
  }

  return data?.length || 0;
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