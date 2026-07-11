-- Opportunities table: admin-posted job and scholarship opportunities
CREATE TABLE opportunities (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  title           text NOT NULL,
  description     text NOT NULL,
  type            text NOT NULL CHECK (type IN ('job', 'scholarship')),
  organization    text NOT NULL,
  location        text NOT NULL,
  deadline        text,              -- display text only, e.g. "March 30, 2025"
  requirements    text,              -- eligibility / requirements (optional)
  application_url text NOT NULL,     -- external apply link
  image_url       text,              -- single Cloudinary image URL (optional)
  is_active       boolean NOT NULL DEFAULT true,
  is_visible      boolean NOT NULL DEFAULT true
);

-- Row Level Security: enabled but allow all reads (filtering is done at app layer)
-- The API routes filter by is_active=true for public pages.
-- The admin portal uses the anon key client-side, so we allow all SELECTs.
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all reads on opportunities"
  ON opportunities
  FOR SELECT
  USING (true);

-- Service role can do everything (used by API routes via supabaseAdmin)
-- No explicit policy needed; service role bypasses RLS by default.
