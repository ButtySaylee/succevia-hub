-- Add PIN hash column for seller verification
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS seller_pin_hash text;

-- Backfill existing rows with a temporary hash placeholder (optional)
-- Existing listings must be reset by sellers with a new listing if strict security is required.
UPDATE listings
SET seller_pin_hash = COALESCE(seller_pin_hash, '')
WHERE seller_pin_hash IS NULL;

-- Enforce non-null for new writes
ALTER TABLE listings
ALTER COLUMN seller_pin_hash SET NOT NULL;

-- Helpful index for seller auth lookup
CREATE INDEX IF NOT EXISTS listings_seller_auth_idx
ON listings (seller_whatsapp, seller_pin_hash);
