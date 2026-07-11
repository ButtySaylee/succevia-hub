// app/api/opportunities/cleanup-expired/route.ts
// Cron endpoint to automatically hide opportunities past their deadline.
// Call this periodically (e.g., daily via Vercel Cron Jobs or external cron service).
// Protected with the same admin auth used by other /api/opportunities/* routes.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { parseDeadlineToDate } from "@/lib/opportunity-utils";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    // Verify admin authorization
    const authError = verifyAdminRequest(req);
    if (authError) return authError;

    // Fetch all active opportunities, preferring the new visibility flag when available.
    const visibleQuery = supabaseAdmin
      .from("opportunities")
      .select("id, deadline, title")
      .eq("is_active", true)
      .eq("is_visible", true);

    const visibleResult = await visibleQuery;
    let opportunities = visibleResult.data;
    let fetchError = visibleResult.error;

    if (fetchError && /is_visible/i.test(fetchError.message)) {
      const fallbackResult = await supabaseAdmin
        .from("opportunities")
        .select("id, deadline, title")
        .eq("is_active", true);
      opportunities = fallbackResult.data;
      fetchError = fallbackResult.error;
    }

    if (fetchError) {
      console.error("[cleanup-expired] Fetch error:", fetchError.message);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!opportunities || opportunities.length === 0) {
      return NextResponse.json({ message: "No visible opportunities to check.", hidden: 0 });
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const expiredIds: string[] = [];

    for (const opp of opportunities) {
      const deadlineDate = parseDeadlineToDate(opp.deadline);
      if (deadlineDate && deadlineDate < now) {
        expiredIds.push(opp.id);
        console.log(`[cleanup-expired] Expired: "${opp.title}" (deadline: ${opp.deadline})`);
      }
    }

    if (expiredIds.length === 0) {
      return NextResponse.json({ message: "No expired opportunities found.", hidden: 0 });
    }

    // Hide all expired opportunities from the public page, or deactivate them when the
    // visibility column does not exist yet.
    const updateResult = fetchError && /is_visible/i.test(fetchError.message)
      ? await supabaseAdmin
          .from("opportunities")
          .update({ is_active: false })
          .in("id", expiredIds)
      : await supabaseAdmin
          .from("opportunities")
          .update({ is_visible: false })
          .in("id", expiredIds);

    const { error: updateError } = updateResult;

    if (updateError) {
      console.error("[cleanup-expired] Update error:", updateError.message);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(`[cleanup-expired] Hid ${expiredIds.length} expired opportunities.`);

    return NextResponse.json({
      message: `Hid ${expiredIds.length} expired opportunities.`,
      hidden: expiredIds.length,
      expiredIds,
    });
  } catch (err) {
    console.error("[cleanup-expired] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}