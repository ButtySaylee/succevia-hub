import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  const { id, seller_whatsapp } = await req.json();

  if (!id || !seller_whatsapp) {
    return NextResponse.json(
      { error: "Missing id or seller_whatsapp" },
      { status: 400 }
    );
  }

  const waClean = String(seller_whatsapp).replace(/\s/g, "");
  if (!/^\+?[0-9]{7,15}$/.test(waClean)) {
    return NextResponse.json(
      { error: "Invalid WhatsApp number format" },
      { status: 400 }
    );
  }

  const { error, data } = await supabaseAdmin
    .from("listings")
    .update({ is_sold: true })
    .eq("id", id)
    .eq("seller_whatsapp", waClean)
    .eq("is_approved", true)
    .eq("is_sold", false)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Listing not found or WhatsApp does not match" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
