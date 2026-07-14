import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest) {
  const authError = verifyAdminRequest(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Request ID is required." }, { status: 400 });
    }

    const updates: Record<string, any> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.description !== undefined) updates.description = String(body.description).trim();
    if (body.category !== undefined) updates.category = String(body.category).trim();
    if (body.budget !== undefined) updates.budget = String(body.budget).trim() || null;
    if (body.country !== undefined) updates.country = String(body.country).trim();
    if (body.county !== undefined) updates.county = String(body.county).trim() || null;
    if (body.city !== undefined) updates.city = String(body.city).trim() || null;
    if (body.service_mode !== undefined) updates.service_mode = String(body.service_mode).trim();
    if (body.urgency !== undefined) updates.urgency = String(body.urgency).trim();
    if (body.whatsapp !== undefined) updates.whatsapp = String(body.whatsapp).trim();
    if (body.status !== undefined) updates.status = String(body.status).trim();
    if (body.is_visible !== undefined) updates.is_visible = Boolean(body.is_visible);

    // Handle name field (which stores JSON {n: name, i: image_urls[]})
    if (body.name !== undefined || body.image_urls !== undefined) {
      const existingNameField = body.nameExisting || null;
      let parsed: { n: string; i: string[] } = { n: "", i: [] };
      if (existingNameField && typeof existingNameField === "string" && existingNameField.startsWith("{")) {
        try { parsed = JSON.parse(existingNameField); } catch {}
      }
      if (body.name !== undefined) parsed.n = String(body.name).trim();
      if (body.image_urls !== undefined) parsed.i = Array.isArray(body.image_urls) ? body.image_urls : [];
      updates.name = JSON.stringify(parsed);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("service_requests")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("[services/update] Supabase error:", error);
      return NextResponse.json({ error: "Failed to update request." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[services/update] Unexpected error:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = verifyAdminRequest(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Request ID is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("service_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[services/update] Delete error:", error);
      return NextResponse.json({ error: "Failed to delete request." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[services/update] Unexpected error:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}