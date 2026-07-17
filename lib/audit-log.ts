import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest } from "next/server";
import { getClientIp } from "@/lib/rate-limit";

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  admin_ip?: string;
  created_at?: string;
}

/**
 * Log an admin action to the audit_logs table.
 * This provides a tamper-evident trail of all administrative operations.
 */
export async function logAdminAction(
  req: NextRequest,
  entry: AuditLogEntry
): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("audit_logs").insert({
      action: entry.action,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id || null,
      details: entry.details || null,
      admin_ip: getClientIp(req),
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[audit-log] Failed to log admin action:", error.message);
    }
  } catch (err) {
    console.error("[audit-log] Unexpected error:", err);
  }
}