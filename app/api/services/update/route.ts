import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, is_visible } = body;

    if (!id) {
      return NextResponse.json({ error: "Request ID is required." }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (is_visible !== undefined) updateData.is_visible = is_visible;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("service_requests")
      .update(updateData)
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
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

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