-- Add missing columns to opportunities table if they don't exist
ALTER TABLE IF EXISTS opportunities ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE IF EXISTS opportunities ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;