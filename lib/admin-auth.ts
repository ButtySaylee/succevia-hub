import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || "fallback-secret-change-me";
const JWT_EXPIRY = "24h";

/**
 * Generates a JWT token for admin authentication with 24-hour expiry.
 */
export function generateAdminToken(): string {
  return jwt.sign(
    {
      role: "admin",
      issuedAt: Date.now(),
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Verifies the admin JWT token from the Authorization header.
 * Returns a 401 NextResponse if the request is not authorised,
 * or null if the caller is allowed to proceed.
 */
export function verifyAdminRequest(req: NextRequest): NextResponse | null {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}