-- Fix: Allow NULL values for image_url in opportunities table
-- This makes images optional so you can add them later through admin portal

ALTER TABLE opportunities
ALTER COLUMN image_url DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'opportunities' AND column_name = 'image_url';
