-- ============================================================
-- Succevia Hub – Audit Logs Table
-- Run this in your Supabase SQL Editor
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

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs (resource_type, resource_id);

-- Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only the service role (backend) can access audit_logs
CREATE POLICY "Service role only - audit_logs"
  ON audit_logs
  FOR ALL
  USING (auth.role() = 'service_role');