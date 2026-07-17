import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashSellerPin, isValidPin, normalizePin } from "@/lib/seller-auth";

interface SetNewPinPayload {
  reset_token: string;
  new_pin: string;
  new_pin_confirm: string;
}

export async function POST(req: NextRequest) {
  const { reset_token, new_pin, new_pin_confirm } = (await req.json()) as SetNewPinPayload;

  if (!reset_token) {
    return NextResponse.json({ error: "Missing reset token" }, { status: 400 });
  }

  const pin = normalizePin(String(new_pin ?? ""));
  const pinConfirm = normalizePin(String(new_pin_confirm ?? ""));

  if (!isValidPin(pin)) {
    return NextResponse.json({ error: "PIN must be 4 to 8 digits" }, { status: 400 });
  }

  if (pin !== pinConfirm) {
    return NextResponse.json({ error: "PIN confirmation does not match" }, { status: 400 });
  }

  // Find the reset request (include seller_whatsapp so we can update ALL their listings)
  const { data: resetRequest } = await supabaseAdmin
    .from("pin_reset_requests")
    .select("id, listing_id, seller_whatsapp, status, expires_at")
    .eq("reset_token", reset_token)
    .single();

  if (!resetRequest) {
    return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 404 });
  }

  if (resetRequest.status !== "approved") {
    return NextResponse.json(
      { error: "PIN reset request has not been approved yet" },
      { status: 400 }
    );
  }

  // Check if the token has expired
  if (resetRequest.expires_at && new Date(resetRequest.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Reset token has expired. Please submit a new PIN reset request." },
      { status: 400 }
    );
  }

  let newPinHash: string;
  try {
    newPinHash = await hashSellerPin(pin);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PIN configuration error" },
      { status: 500 }
    );
  }

  // Update ALL listings belonging to this seller's WhatsApp (not just one)
  const [updateListingsResult, updateRequestResult] = await Promise.all([
    supabaseAdmin
      .from("listings")
      .update({ seller_pin_hash: newPinHash })
      .eq("seller_whatsapp", resetRequest.seller_whatsapp),
    supabaseAdmin
      .from("pin_reset_requests")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", resetRequest.id),
  ]);

  if (updateListingsResult.error || updateRequestResult.error) {
    return NextResponse.json(
      { error: updateListingsResult.error?.message || updateRequestResult.error?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "PIN reset successfully. All your listings are now updated. You can login with your new PIN.",
  });
}
