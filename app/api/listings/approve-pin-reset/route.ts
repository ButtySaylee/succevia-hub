import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminRequest } from "@/lib/admin-auth";

interface ApprovePinResetPayload {
  request_id: string;
  action: "approve" | "deny";
}

export async function DELETE(req: NextRequest) {
  const authError = verifyAdminRequest(req);
  if (authError) return authError;

  const { request_id } = (await req.json()) as { request_id: string };

  if (!request_id) {
    return NextResponse.json({ error: "Missing request_id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("pin_reset_requests")
    .delete()
    .eq("id", request_id)
    .in("status", ["completed", "denied"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const authError = verifyAdminRequest(req);
  if (authError) return authError;

  const { request_id, action } = (await req.json()) as ApprovePinResetPayload;

  if (!request_id || !action || !["approve", "deny"].includes(action)) {
    return NextResponse.json(
      { error: "Missing or invalid request_id or action" },
      { status: 400 }
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

  return NextResponse.json({ ok: true, message: `Pin reset request ${newStatus}` });
}
