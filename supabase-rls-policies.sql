-- =============================================================================
-- Succevia Hub Row Level Security (RLS) Policies
-- =============================================================================
-- This file contains all security policies for the Supabase database.
-- Run this in Supabase SQL Editor to secure your database.
-- =============================================================================

-- =============================================================================
-- LISTINGS TABLE
-- =============================================================================

-- Enable Row Level Security on listings table
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view approved listings" ON listings;
DROP POLICY IF EXISTS "Anyone can insert listings" ON listings;
DROP POLICY IF EXISTS "Service role can update listings" ON listings;
DROP POLICY IF EXISTS "Service role can delete listings" ON listings;
DROP POLICY IF EXISTS "public_read_approved_listings" ON listings;
DROP POLICY IF EXISTS "public_insert_listings" ON listings;
DROP POLICY IF EXISTS "service_role_all_access" ON listings;

-- Allow anonymous users to view only approved listings
CREATE POLICY "public_read_approved_listings"
ON listings
FOR SELECT
USING (is_approved = true);

-- Allow anonymous users to submit new listings (client-side via anon key)
CREATE POLICY "public_insert_listings"
ON listings
FOR INSERT
WITH CHECK (true);

-- Service role (backend) has full access to all operations
CREATE POLICY "service_role_all_access"
ON listings
FOR ALL
USING (auth.role() = 'service_role');

-- =============================================================================
-- SERVICE REQUESTS TABLE
-- =============================================================================

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

-- =============================================================================
-- OPPORTUNITIES TABLE
-- =============================================================================

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all reads on opportunities" ON opportunities;

CREATE POLICY "Public can view active opportunities"
  ON opportunities FOR SELECT
  USING (is_active = true);

-- =============================================================================
-- RATE LIMITS TABLE (service role only)
-- =============================================================================

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only - rate_limits" ON rate_limits;
CREATE POLICY "Service role only - rate_limits"
  ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================================================
-- AUDIT LOGS TABLE (service role only)
-- =============================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only - audit_logs" ON audit_logs;
CREATE POLICY "Service role only - audit_logs"
  ON audit_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================================================
-- ADMIN LOCKOUTS TABLE (service role only)
-- =============================================================================

ALTER TABLE admin_lockouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only - admin_lockouts" ON admin_lockouts;
CREATE POLICY "Service role only - admin_lockouts"
  ON admin_lockouts
  FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Show all policies for verification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
ORDER BY tablename, policyname;
