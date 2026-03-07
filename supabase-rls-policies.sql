-- =============================================================================
-- GbanaMarket Row Level Security (RLS) Policies
-- =============================================================================
-- This file contains all security policies for the Supabase database.
-- Run this in Supabase SQL Editor to secure your database.
--
-- IMPORTANT: Review and test these policies before deploying to production.
-- =============================================================================

-- Enable Row Level Security on listings table
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PUBLIC READ POLICIES
-- =============================================================================

-- Allow anonymous users to view only approved listings
CREATE POLICY "public_read_approved_listings"
ON listings
FOR SELECT
USING (is_approved = true);

-- =============================================================================
-- SERVICE ROLE POLICIES (Full Access)
-- =============================================================================

-- Service role (backend) has full access to all operations
-- This is used by API routes that use supabaseAdmin client
CREATE POLICY "service_role_all_access"
ON listings
FOR ALL
USING (auth.role() = 'service_role');

-- =============================================================================
-- SECURITY NOTES
-- =============================================================================
-- 
-- 1. Only approved listings are visible to the public
-- 2. All write operations (INSERT, UPDATE, DELETE) must go through API routes
--    using the service role key (SUPABASE_SERVICE_ROLE_KEY)
-- 3. Never expose the service role key in client-side code
-- 4. The anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) only has SELECT permission
--    for approved listings
-- 
-- =============================================================================
-- ADDITIONAL RECOMMENDATIONS
-- =============================================================================
--
-- Consider adding these columns to track data better:
--   - view_count INTEGER DEFAULT 0
--   - last_viewed_at TIMESTAMPTZ
--   - expires_at TIMESTAMPTZ (for auto-expiring old listings)
--   - updated_at TIMESTAMPTZ
--
-- You may also want to add policies for:
--   - Rate limiting (using PostgreSQL functions)
--   - IP-based restrictions
--   - Time-based restrictions (e.g., no new listings after midnight)
--
-- =============================================================================

-- Verify RLS is enabled
DO $$
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'listings') THEN
    RAISE EXCEPTION 'RLS is not enabled on listings table!';
  END IF;
END $$;

-- Show all policies (for verification)
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
WHERE tablename = 'listings';
