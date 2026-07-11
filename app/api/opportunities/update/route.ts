import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest) {
  const authError = verifyAdminRequest(req);
  if (authError) return authError;

  const body = await req.json();
  const id = String(body.id ?? "").trim();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updates: Record<string, string | boolean | null> = {};

  if (body.title !== undefined) updates.title = String(body.title).trim();
  if (body.description !== undefined) updates.description = String(body.description).trim();
  if (body.type !== undefined) updates.type = String(body.type).trim();
  if (body.organization !== undefined) updates.organization = String(body.organization).trim();
  if (body.location !== undefined) updates.location = String(body.location).trim();
  if (body.deadline !== undefined) updates.deadline = String(body.deadline).trim() || null;
  if (body.requirements !== undefined) updates.requirements = String(body.requirements).trim() || null;
  if (body.application_url !== undefined) updates.application_url = String(body.application_url).trim();
  if (body.image_url !== undefined) updates.image_url = String(body.image_url).trim() || null;
  if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
  if (body.is_visible !== undefined) updates.is_visible = Boolean(body.is_visible);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("opportunities")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
