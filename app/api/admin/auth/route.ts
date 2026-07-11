import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function hashPassword(password: string): string {
  return createHmac("sha256", password).update("gbana_admin_v1").digest("hex");
}

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = getClientIp(req);
  const rl = checkRateLimit(`admin-auth:${ip}`, { maxRequests: 10, windowMs: 15 * 60 * 1000 });
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

    const hashed = hashPassword(password);
    const expected = hashPassword(ADMIN_PASSWORD);

    if (hashed !== expected) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate a session token (hashed password serves as token)
    const token = createHmac("sha256", ADMIN_PASSWORD)
      .update(`session:${Date.now()}`)
      .digest("hex");

    return NextResponse.json({ token, success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}