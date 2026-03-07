import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface ApprovePinResetPayload {
  request_id: string;
  action: "approve" | "deny";
  admin_password?: string;
}

export async function POST(req: NextRequest) {
  const { request_id, action, admin_password } = (await req.json()) as ApprovePinResetPayload;

  if (!request_id || !action || !["approve", "deny"].includes(action)) {
    return NextResponse.json(
      { error: "Missing or invalid request_id or action" },
      { status: 400 }
    );
  }

  // Verify admin password
  if (admin_password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid admin password" },
      { status: 401 }
    );
  }

  const newStatus = action === "approve" ? "approved" : "denied";

  const { error } = await supabaseAdmin
    .from("pin_reset_requests")
    .update({
      status: newStatus,
      approved_at: action === "approve" ? new Date().toISOString() : null,
    })
    .eq("id", request_id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: `Pin reset request ${newStatus}`,
  });
}
