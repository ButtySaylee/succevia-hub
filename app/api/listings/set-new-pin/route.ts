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
    return NextResponse.json(
      { error: "Missing reset token" },
      { status: 400 }
    );
  }

  const pin = normalizePin(String(new_pin ?? ""));
  const pinConfirm = normalizePin(String(new_pin_confirm ?? ""));

  if (!isValidPin(pin)) {
    return NextResponse.json(
      { error: "PIN must be 4 to 8 digits" },
      { status: 400 }
    );
  }

  if (pin !== pinConfirm) {
    return NextResponse.json(
      { error: "PIN confirmation does not match" },
      { status: 400 }
    );
  }

  // Find the reset request
  const { data: resetRequest } = await supabaseAdmin
    .from("pin_reset_requests")
    .select("id, listing_id, status")
    .eq("reset_token", reset_token)
    .single();

  if (!resetRequest) {
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 404 }
    );
  }

  if (resetRequest.status !== "approved") {
    return NextResponse.json(
      { error: "PIN reset request has not been approved yet" },
      { status: 400 }
    );
  }

  let newPinHash: string;
  try {
    newPinHash = hashSellerPin(pin);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "PIN configuration error",
      },
      { status: 500 }
    );
  }

  // Update listing with new PIN and mark request as completed
  const [updateListingResult, updateRequestResult] = await Promise.all([
    supabaseAdmin
      .from("listings")
      .update({ seller_pin_hash: newPinHash })
      .eq("id", resetRequest.listing_id),
    supabaseAdmin
      .from("pin_reset_requests")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", resetRequest.id),
  ]);

  if (updateListingResult.error || updateRequestResult.error) {
    return NextResponse.json(
      {
        error: updateListingResult.error?.message || updateRequestResult.error?.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "PIN reset successfully. You can now login with your new PIN.",
  });
}
