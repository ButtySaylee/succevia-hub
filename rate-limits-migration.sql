-- ============================================================
-- Succevia Hub – Rate Limits Table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Create the rate_limits table for distributed rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast queries by identifier and time window
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_created
ON rate_limits (identifier, created_at DESC);

-- Auto-cleanup: delete records older than 24 hours
-- Run this periodically (e.g., via pg_cron or a cron job)
-- DELETE FROM rate_limits WHERE created_at < now() - interval '24 hours';

-- Row Level Security
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Only the service role (backend) can access rate_limits
CREATE POLICY "Service role only - rate_limits"
  ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role');