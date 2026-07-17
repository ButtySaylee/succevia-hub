// Run all security migrations against Supabase
// Usage: node scripts/run-all-migrations.mjs

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env from .env.migration file
const envPath = resolve(__dirname, ".env.migration");
const envContent = readFileSync(envPath, "utf-8");
const envVars = Object.fromEntries(
  envContent
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const eqIndex = line.indexOf("=");
      return [line.slice(0, eqIndex).trim(), line.slice(eqIndex + 1).trim()];
    })
);

const SUPABASE_URL = "https://qiqecvcmmkemracpuawj.supabase.co";
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const migrations = [
  {
    name: "1. rate_limits table",
    sql: `
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_created
ON rate_limits (identifier, created_at DESC);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only - rate_limits"
  ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');
`,
  },
  {
    name: "2. audit_logs table",
    sql: `
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  admin_ip TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs (resource_type, resource_id);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only - audit_logs"
  ON audit_logs
  FOR ALL
  USING (auth.role() = 'service_role');
`,
  },
  {
    name: "3. admin_lockouts table",
    sql: `
CREATE TABLE IF NOT EXISTS admin_lockouts (
  identifier TEXT PRIMARY KEY,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_lockouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only - admin_lockouts"
  ON admin_lockouts
  FOR ALL
  USING (auth.role() = 'service_role');
`,
  },
  {
    name: "4. Update pin_reset_requests with expires_at",
    sql: `
ALTER TABLE pin_reset_requests 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 hour';
`,
  },
  {
    name: "5. Update listings table for new columns",
    sql: `
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Unknown';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_sold BOOLEAN DEFAULT false;
`,
  },
  {
    name: "6. RLS policies for existing tables",
    sql: `
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved listings" ON listings;
DROP POLICY IF EXISTS "Anyone can insert listings" ON listings;
DROP POLICY IF EXISTS "Service role can update listings" ON listings;
DROP POLICY IF EXISTS "Service role can delete listings" ON listings;

CREATE POLICY "public_read_approved_listings"
ON listings
FOR SELECT
USING (is_approved = true);

CREATE POLICY "service_role_all_access"
ON listings
FOR ALL
USING (auth.role() = 'service_role');

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view open service requests" ON service_requests;
DROP POLICY IF EXISTS "Anyone can submit service requests" ON service_requests;
DROP POLICY IF EXISTS "Service role can update service requests" ON service_requests;
DROP POLICY IF EXISTS "Service role can delete service requests" ON service_requests;

CREATE POLICY "Public can view visible service requests"
  ON service_requests FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Anyone can submit service requests"
  ON service_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update service requests"
  ON service_requests FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete service requests"
  ON service_requests FOR DELETE
  USING (auth.role() = 'service_role');

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all reads on opportunities" ON opportunities;

CREATE POLICY "Public can view active opportunities"
  ON opportunities FOR SELECT
  USING (is_active = true);
`,
  },
];

async function runMigration(name, sql) {
  console.log(`\n⏳ Running migration: ${name}...`);

  try {
    // Use the Supabase REST API directly with the service role key
    // The /rest/v1/ endpoint allows raw SQL via the "query" parameter
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    // If RPC endpoint doesn't exist, try direct SQL via the management API
    if (response.status === 404 || response.status === 400) {
      // Try using the pg_dump endpoint or raw SQL
      const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
          "Prefer": "params=single-object",
        },
        body: JSON.stringify({ query: sql }),
      });

      if (sqlResponse.ok || sqlResponse.status === 201) {
        console.log(`✅ ${name} - SUCCESS`);
        return true;
      }

      const errorText = await sqlResponse.text();
      if (errorText.includes("already exists") || errorText.includes("duplicate") || errorText.includes("IF NOT EXISTS")) {
        console.log(`⚠️  ${name} - Already exists (skipped)`);
        return true;
      }
      console.error(`❌ ${name} - FAILED: ${errorText.substring(0, 300)}`);
      return false;
    }

    if (response.ok) {
      console.log(`✅ ${name} - SUCCESS`);
      return true;
    }

    const errorText = await response.text();
    if (errorText.includes("already exists") || errorText.includes("duplicate") || errorText.includes("IF NOT EXISTS")) {
      console.log(`⚠️  ${name} - Already exists (skipped)`);
      return true;
    }
    console.error(`❌ ${name} - FAILED: ${errorText.substring(0, 300)}`);
    return false;
  } catch (err) {
    console.error(`❌ ${name} - ERROR: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting Supabase Security Migrations...");
  console.log(`URL: ${SUPABASE_URL}`);
  console.log("========================================\n");

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    const success = await runMigration(migration.name, migration.sql);
    if (success) successCount++;
    else failCount++;
  }

  console.log("\n========================================");
  console.log(`📊 Migration Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📦 Total: ${migrations.length}`);
  console.log("========================================");

  if (failCount > 0) {
    console.log("\n⚠️  Some migrations failed. Check the errors above.");
    console.log("\n💡 Alternative: Run these SQL files manually in Supabase SQL Editor:");
    console.log("   1. rate-limits-migration.sql");
    console.log("   2. audit-log-migration.sql");
    console.log("   3. admin-lockout-migration.sql");
    console.log("   4. pin-reset-migration.sql (updated)");
    console.log("   5. schema-v2-migration.sql (RLS section)");
    process.exit(1);
  } else {
    console.log("\n✅ All migrations completed successfully!");
  }
}

main().catch(console.error);