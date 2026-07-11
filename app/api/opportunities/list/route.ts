import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Opportunity } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const type = searchParams.get("type") ?? "all";
  const q = searchParams.get("q")?.trim() ?? "";
  const itemsPerPage = 12;

  const MONTH_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function parseDeadlineMonth(deadline: string | undefined): number {
    if (!deadline) return 13;
    const month = MONTH_ORDER.find(m => deadline.includes(m));
    return month ? MONTH_ORDER.indexOf(month) : 13;
  }

  const baseSelectFields =
    "id, created_at, title, description, type, organization, location, deadline, requirements, application_url, image_url, is_active";

  const selectFields = (includeVisibility: boolean) =>
    includeVisibility ? `${baseSelectFields}, is_visible` : baseSelectFields;

  async function buildQuery(includeVisibility: boolean) {
    let query = supabaseAdmin
      .from("opportunities")
      .select(selectFields(includeVisibility), { count: "exact" })
      .eq("is_active", true);

    if (includeVisibility) {
      query = query.eq("is_visible", true);
    }

    if (type !== "all") query = query.eq("type", type);

    if (q) {
      const escaped = q.replace(/,/g, " ");
      query = query.or(
        `title.ilike.%${escaped}%,description.ilike.%${escaped}%,organization.ilike.%${escaped}%`
      );
    }

    return query;
  }

  let { data, count, error } = await buildQuery(true);

  if (error && /is_visible/i.test(error.message)) {
    const fallback = await buildQuery(false);
    data = fallback.data;
    count = fallback.count;
    error = fallback.error;
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let opportunities: Opportunity[] = ((data ?? []) as Opportunity[]).map((opportunity) => ({
    ...opportunity,
    is_visible: opportunity.is_visible ?? true,
  }));

  // Sort by month order (January to December)
  opportunities = opportunities.sort((a, b) => {
    const monthA = parseDeadlineMonth(a.deadline);
    const monthB = parseDeadlineMonth(b.deadline);
    if (monthA !== monthB) return monthA - monthB;
    
    // If same month, sort by newest first
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Apply pagination after sorting
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  opportunities = opportunities.slice(start, end);

  return NextResponse.json({ opportunities, total: count ?? 0 });
}
