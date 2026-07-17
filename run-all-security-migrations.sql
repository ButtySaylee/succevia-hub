-- ============================================================
-- Succevia Hub – Complete Security Migrations
-- Copy and paste this entire file into Supabase SQL Editor
-- Run in order (each section is independent)
-- ============================================================

-- ============================================================
-- 1. Create exec_sql function (for programmatic SQL execution)
-- ============================================================
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- ============================================================
-- 2. rate_limits table (for distributed rate limiting)
-- ============================================================
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_created
ON rate_limits (identifier, created_at DESC);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only - rate_limits" ON rate_limits;
CREATE POLICY "Service role only - rate_limits"
  ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 3. audit_logs table (for admin action tracking)
-- ============================================================
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

DROP POLICY IF EXISTS "Service role only - audit_logs" ON audit_logs;
CREATE POLICY "Service role only - audit_logs"
  ON audit_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 4. admin_lockouts table (for account lockout after 5 failures)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_lockouts (
  identifier TEXT PRIMARY KEY,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_lockouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only - admin_lockouts" ON admin_lockouts;
CREATE POLICY "Service role only - admin_lockouts"
  ON admin_lockouts
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 5. Update pin_reset_requests with expires_at column
-- ============================================================
ALTER TABLE pin_reset_requests 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 hour';

-- ============================================================
-- 6. Update listings table with missing columns
-- ============================================================
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Unknown';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_sold BOOLEAN DEFAULT false;

-- ============================================================
-- 7. RLS policies for listings table
-- ============================================================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved listings" ON listings;
DROP POLICY IF EXISTS "Anyone can insert listings" ON listings;
DROP POLICY IF EXISTS "Service role can update listings" ON listings;
DROP POLICY IF EXISTS "Service role can delete listings" ON listings;
DROP POLICY IF EXISTS "public_read_approved_listings" ON listings;
DROP POLICY IF EXISTS "service_role_all_access" ON listings;

-- Public read: only approved listings
CREATE POLICY "public_read_approved_listings"
ON listings
FOR SELECT
USING (is_approved = true);

-- Service role full access
CREATE POLICY "service_role_all_access"
ON listings
FOR ALL
USING (auth.role() = 'service_role');

-- ============================================================
-- 8. RLS policies for service_requests table
-- ============================================================
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

-- ============================================================
-- 9. RLS policies for opportunities table
-- ============================================================
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all reads on opportunities" ON opportunities;

CREATE POLICY "Public can view active opportunities"
  ON opportunities FOR SELECT
  USING (is_active = true);

-- ============================================================
-- 10. Verify all migrations
-- ============================================================
SELECT '✅ rate_limits' AS migration_check FROM pg_tables WHERE tablename = 'rate_limits'
UNION ALL
SELECT '✅ audit_logs' FROM pg_tables WHERE tablename = 'audit_logs'
UNION ALL
SELECT '✅ admin_lockouts' FROM pg_tables WHERE tablename = 'admin_lockouts'
UNION ALL
SELECT '✅ pin_reset_requests has expires_at' FROM information_schema.columns 
  WHERE table_name = 'pin_reset_requests' AND column_name = 'expires_at'
UNION ALL
SELECT '✅ listings has is_negotiable' FROM information_schema.columns 
  WHERE table_name = 'listings' AND column_name = 'is_negotiable'
UNION ALL
SELECT '✅ listings has is_sold' FROM information_schema.columns 
  WHERE table_name = 'listings' AND column_name = 'is_sold'
UNION ALL
SELECT '✅ listings has location' FROM information_schema.columns 
  WHERE table_name = 'listings' AND column_name = 'location';