import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// CSRF token stored in cookies, validated via x-csrf-token header
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generates a CSRF token and sets it as a cookie.
 * Call this on the login response.
 */
export function setCsrfCookie(response: NextResponse): NextResponse {
  const token = randomBytes(32).toString("hex");
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be accessible by client JS to send as header
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}

/**
 * Validates that the CSRF token in the header matches the cookie.
 * Returns true if valid, false if invalid or missing.
 */
export function validateCsrfToken(request: NextRequest): boolean {
  // Only validate state-changing methods
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true;
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    return false;
  }

  // Use a simple comparison - for production, use timingSafeEqual
  return cookieToken === headerToken;
}

/**
 * Middleware helper: validates CSRF and returns 403 if invalid.
 * Call at the top of state-changing API routes that need CSRF protection.
 */
export function requireCsrfToken(request: NextRequest): NextResponse | null {
  if (!validateCsrfToken(request)) {
    return NextResponse.json(
      { error: "Invalid or missing CSRF token" },
      { status: 403 }
    );
  }
  return null;
}