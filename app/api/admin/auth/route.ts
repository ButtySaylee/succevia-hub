import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { generateAdminToken } from "@/lib/admin-auth";
import { setCsrfCookie } from "@/lib/csrf";
import { supabaseAdmin } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ACCOUNT_LOCKOUT_THRESHOLD = 5; // Lock after 5 failed attempts
const ACCOUNT_LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Validates admin password strength.
 * Requires: minimum 12 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
function isPasswordStrong(password: string): boolean {
  if (password.length < 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = getClientIp(req);
  const rl = await checkRateLimit(`admin-auth:${ip}`, { maxRequests: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const { password } = await req.json();

    if (!password || !ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the admin account is locked out
    const { data: lockoutRecord } = await supabaseAdmin
      .from("admin_lockouts")
      .select("failed_attempts, locked_until")
      .eq("identifier", "admin")
      .single();

    if (lockoutRecord?.locked_until && new Date(lockoutRecord.locked_until) > new Date()) {
      const retryAfter = Math.ceil(
        (new Date(lockoutRecord.locked_until).getTime() - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          error: "Account is temporarily locked due to too many failed attempts. Please try again later.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    // Timing-safe comparison to prevent timing attacks
    const pwBuf = Buffer.from(password);
    const expectedBuf = Buffer.from(ADMIN_PASSWORD);
    const isValid =
      pwBuf.length === expectedBuf.length &&
      timingSafeEqual(pwBuf, expectedBuf);

    if (!isValid) {
      // Record failed attempt
      const newAttempts = (lockoutRecord?.failed_attempts || 0) + 1;
      const shouldLock = newAttempts >= ACCOUNT_LOCKOUT_THRESHOLD;

      await supabaseAdmin.from("admin_lockouts").upsert(
        {
          identifier: "admin",
          failed_attempts: newAttempts,
          locked_until: shouldLock
            ? new Date(Date.now() + ACCOUNT_LOCKOUT_DURATION_MS).toISOString()
            : null,
          last_failed_at: new Date().toISOString(),
        },
        { onConflict: "identifier" }
      );

      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Successful login - reset failed attempts
    await supabaseAdmin.from("admin_lockouts").upsert(
      {
        identifier: "admin",
        failed_attempts: 0,
        locked_until: null,
        last_failed_at: null,
      },
      { onConflict: "identifier" }
    );

    // Warn if admin password is weak
    const passwordIsWeak = !isPasswordStrong(ADMIN_PASSWORD);

    // Generate a JWT token with 24-hour expiry
    const token = generateAdminToken();

    // Set CSRF cookie for subsequent state-changing requests
    const response = NextResponse.json({
      token,
      success: true,
      expiresIn: "24h",
      warning: passwordIsWeak
        ? "Admin password does not meet security recommendations (min 12 chars, uppercase, lowercase, number, special char). Please update it."
        : undefined,
    });
    return setCsrfCookie(response);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
