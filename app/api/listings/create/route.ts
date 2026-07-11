import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashSellerPin, normalizeWhatsapp } from "@/lib/seller-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit: 5 listings per hour per IP
  const ip = getClientIp(req);
  const rl = checkRateLimit(`create:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before posting another listing." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      price,
      category,
      seller_whatsapp,
      seller_pin,
      image_urls,
      location,
      is_negotiable,
    } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!price?.trim()) {
      return NextResponse.json({ error: "Price is required." }, { status: 400 });
    }
    if (!seller_whatsapp?.trim()) {
      return NextResponse.json({ error: "WhatsApp number is required." }, { status: 400 });
    }
    if (!seller_pin?.trim()) {
      return NextResponse.json({ error: "Seller PIN is required." }, { status: 400 });
    }
    if (!image_urls || image_urls.length === 0) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }
    if (image_urls.length > 5) {
      return NextResponse.json({ error: "Maximum of 5 images allowed." }, { status: 400 });
    }

    const waClean = normalizeWhatsapp(seller_whatsapp);
    const pinHash = hashSellerPin(seller_pin.trim());

    const { data, error } = await supabaseAdmin
      .from("listings")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        price: price.trim(),
        category,
        seller_whatsapp: waClean,
        seller_pin_hash: pinHash,
        image_urls,
        location: location || "Unknown",
        is_negotiable: is_negotiable ?? false,
        is_approved: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[listings/create] Supabase error:", error);
      return NextResponse.json({ error: "Failed to create listing. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id }, { status: 201 });
  } catch (err) {
    console.error("[listings/create] Unexpected error:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}