import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const category = searchParams.get("category") ?? "All";
  const q = searchParams.get("q")?.trim() ?? "";
  const status = searchParams.get("status") ?? "all";
  const itemsPerPage = 30;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage - 1;

  let query = supabase
    .from("listings")
    .select("id, created_at, title, description, price, category, image_urls, seller_whatsapp, is_approved, is_negotiable, location, is_sold", { count: "exact" })
    .eq("is_approved", true)
    .order("is_sold", { ascending: true })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (category !== "All") query = query.eq("category", category);
  if (status === "available") query = query.eq("is_sold", false);
  if (q) {
    const escaped = q.replace(/,/g, " ");
    query = query.or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data ?? [], total: count ?? 0 });
}
