import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeWhatsapp, isValidWhatsapp } from "@/lib/seller-auth";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { seller_whatsapp, reason } = await req.json();

  if (!seller_whatsapp) {
    return NextResponse.json(
      { error: "Missing seller_whatsapp" },
      { status: 400 }
    );
  }

  const waClean = normalizeWhatsapp(String(seller_whatsapp));
  if (!isValidWhatsapp(waClean)) {
    return NextResponse.json(
      { error: "Invalid WhatsApp number format" },
      { status: 400 }
    );
  }

  // Find an active listing for this seller
  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select("id")
    .eq("seller_whatsapp", waClean)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!listing) {
    return NextResponse.json(
      { error: "No active listings found for this WhatsApp number" },
      { status: 404 }
    );
  }

  // Check if there's already a pending request
  const { data: existingRequest } = await supabaseAdmin
    .from("pin_reset_requests")
    .select("id, status")
    .eq("seller_whatsapp", waClean)
    .eq("status", "pending")
    .limit(1)
    .single();

  if (existingRequest) {
    return NextResponse.json(
      {
        error:
          "You already have a pending PIN reset request. Please wait for admin approval.",
      },
      { status: 400 }
    );
  }

  // Create reset request
  const resetToken = randomBytes(32).toString("hex");
  const { error } = await supabaseAdmin.from("pin_reset_requests").insert({
    listing_id: listing.id,
    seller_whatsapp: waClean,
    reason: String(reason ?? "").trim(),
    reset_token: resetToken,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message:
      "PIN reset request submitted. Check your email or WhatsApp for admin approval.",
  });
}
