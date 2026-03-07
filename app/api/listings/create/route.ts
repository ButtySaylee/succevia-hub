import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  hashSellerPin,
  isValidPin,
  isValidWhatsapp,
  normalizePin,
  normalizeWhatsapp,
} from "@/lib/seller-auth";

interface CreateListingPayload {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  image_urls?: string[];
  seller_whatsapp?: string;
  seller_pin?: string;
  location?: string;
  is_negotiable?: boolean;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateListingPayload;

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const price = String(body.price ?? "").trim();
  const category = String(body.category ?? "").trim();
  const location = String(body.location ?? "").trim();
  const imageUrls = Array.isArray(body.image_urls)
    ? body.image_urls.filter((url) => typeof url === "string" && url.length > 0)
    : [];
  const waClean = normalizeWhatsapp(String(body.seller_whatsapp ?? ""));
  const pin = normalizePin(String(body.seller_pin ?? ""));

  if (!title || !description || !price || !category || !location) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (imageUrls.length === 0) {
    return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
  }

  if (!isValidWhatsapp(waClean)) {
    return NextResponse.json({ error: "Invalid WhatsApp number format" }, { status: 400 });
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

  const { error } = await supabaseAdmin.from("listings").insert({
    title,
    description,
    price,
    category,
    image_urls: imageUrls,
    seller_whatsapp: waClean,
    seller_pin_hash: sellerPinHash,
    location,
    is_negotiable: Boolean(body.is_negotiable),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
