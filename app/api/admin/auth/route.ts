import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/admin-auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Return a stateless token derived from the password.
    // The client sends this as "Authorization: Bearer <token>" on admin requests.
    return NextResponse.json({ success: true, token: getAdminToken() });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
