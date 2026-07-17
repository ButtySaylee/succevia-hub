import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  hashSellerPin,
  isValidPin,
  isValidWhatsapp,
  normalizePin,
  normalizeWhatsapp,
} from "@/lib/seller-auth";

export async function DELETE(req: NextRequest) {
  const { listing_id, seller_whatsapp, seller_pin } = await req.json();

  if (!listing_id || !seller_whatsapp || !seller_pin) {
    return NextResponse.json(
      { error: "Missing listing_id, seller_whatsapp, or seller_pin" },
      { status: 400 }
    );
  }

  const waClean = normalizeWhatsapp(String(seller_whatsapp));
  const pin = normalizePin(String(seller_pin));

  if (!isValidWhatsapp(waClean)) {
    return NextResponse.json(
      { error: "Invalid WhatsApp number format" },
      { status: 400 }
    );
  }

  if (!isValidPin(pin)) {
    return NextResponse.json(
      { error: "PIN must be 4 to 8 digits" },
      { status: 400 }
    );
  }

  let pinHash: string;
  try {
    pinHash = await hashSellerPin(pin);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PIN configuration error" },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("listings")
    .delete()
    .eq("id", listing_id)
    .eq("seller_whatsapp", waClean)
    .eq("seller_pin_hash", pinHash)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[seller-delete] Database error:", error);
    return NextResponse.json({ error: "Failed to delete listing." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Listing not found or credentials do not match" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
