-- Create PIN reset requests table
CREATE TABLE IF NOT EXISTS pin_reset_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  seller_whatsapp TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'denied', 'completed'
  reset_token TEXT UNIQUE,  -- One-time token for setting new PIN
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS pin_reset_requests_status_idx
ON pin_reset_requests (status, requested_at DESC);

CREATE INDEX IF NOT EXISTS pin_reset_requests_seller_idx
ON pin_reset_requests (seller_whatsapp, status);

CREATE INDEX IF NOT EXISTS pin_reset_requests_token_idx
ON pin_reset_requests (reset_token);
