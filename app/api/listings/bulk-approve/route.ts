import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authError = verifyAdminRequest(req);
  if (authError) return authError;

  const { ids } = await req.json();
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("listings")
    .update({ is_approved: true })
    .in("id", ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
