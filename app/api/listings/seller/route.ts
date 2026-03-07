import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  hashSellerPin,
  isValidPin,
  isValidWhatsapp,
  normalizePin,
  normalizeWhatsapp,
} from "@/lib/seller-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerWhatsapp = searchParams.get("seller_whatsapp");
  const sellerPin = searchParams.get("seller_pin");

  if (!sellerWhatsapp || !sellerPin) {
    return NextResponse.json(
      { error: "Missing seller_whatsapp or seller_pin" },
      { status: 400 }
    );
  }

  const waClean = normalizeWhatsapp(sellerWhatsapp);
  const pin = normalizePin(sellerPin);

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

  let sellerPinHash: string;
  try {
    sellerPinHash = hashSellerPin(pin);
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

  const { data, error } = await supabaseAdmin
    .from("listings")
    .select(
      "id, created_at, title, description, price, category, image_urls, seller_whatsapp, is_approved, is_negotiable, location, is_sold"
    )
    .eq("seller_whatsapp", waClean)
    .eq("seller_pin_hash", sellerPinHash)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data ?? [] });
}
