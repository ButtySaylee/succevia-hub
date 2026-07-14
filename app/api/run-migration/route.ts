import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const results: string[] = [];
  const errors: string[] = [];

  // Approach 1: Try using RPC exec_sql
  const sql = `ALTER TABLE IF EXISTS service_requests ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';`;
  
  const { error: rpcError } = await supabaseAdmin.rpc("exec_sql", { query: sql });
  if (rpcError) {
    results.push(`❌ RPC exec_sql failed: ${rpcError.message}`);
    errors.push(rpcError.message);
  } else {
    results.push(`✅ Column image_urls added via RPC`);
  }

  // Approach 2: Try direct SQL via the Supabase Management API
  if (errors.length > 0) {
    try {
      const mgmtRes = await fetch("https://api.supabase.com/v1/projects/qiqecvcmmkemracpuawj/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
        },
        body: JSON.stringify({
          query: sql,
        }),
      });
      
      if (mgmtRes.ok) {
        results.push(`✅ Column image_urls added via Management API`);
        errors.length = 0;
      } else {
        const errText = await mgmtRes.text();
        results.push(`❌ Management API: ${errText.substring(0, 100)}`);
      }
    } catch (err) {
      results.push(`❌ Management API error: ${err instanceof Error ? err.message : "Unknown"}`);
    }
  }

  // Verify column exists
  const { error: verifyError } = await supabaseAdmin
    .from("service_requests")
    .select("image_urls")
    .limit(1);

  if (verifyError) {
    results.push(`❌ Verification failed: ${verifyError.message}`);
    
    // Final fallback - suggest manual SQL
    results.push(``);
    results.push(`⚠️  The image_urls column could not be added automatically.`);
    results.push(`Please run this SQL in your Supabase dashboard SQL Editor:`);
    results.push(`  ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';`);
    results.push(``);
    results.push(`Or visit: https://supabase.com/dashboard/project/qiqecvcmmkemracpuawj/sql/new`);
  } else {
    results.push(`✅ image_urls column verified successfully!`);
  }

  return NextResponse.json({ results });
}