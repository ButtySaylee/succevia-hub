-- ============================================================
-- Succevia Hub – Admin Account Lockout Table
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_lockouts (
  identifier TEXT PRIMARY KEY,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE admin_lockouts ENABLE ROW LEVEL SECURITY;

-- Only the service role (backend) can access admin_lockouts
CREATE POLICY "Service role only - admin_lockouts"
  ON admin_lockouts
  FOR ALL
  USING (auth.role() = 'service_role');