-- Verification Queries for 100 Scholarships Import
-- Run these queries after importing to verify everything worked correctly

-- 1. Count total scholarships imported
SELECT COUNT(*) as total_scholarships
FROM opportunities
WHERE type = 'scholarship';
-- Expected: 100+ (including any previously existing scholarships)

-- 2. Count active scholarships
SELECT COUNT(*) as active_scholarships
FROM opportunities
WHERE type = 'scholarship' AND is_active = true;
-- Expected: 100 new active scholarships

-- 3. Count scholarships by region/location (top 10)
SELECT location, COUNT(*) as count
FROM opportunities
WHERE type = 'scholarship'
GROUP BY location
ORDER BY count DESC
LIMIT 10;

-- 4. List all scholarship organizations (unique)
SELECT DISTINCT organization
FROM opportunities
WHERE type = 'scholarship'
ORDER BY organization;

-- 5. Find scholarships with upcoming deadlines (before May 2026)
SELECT title, organization, location, deadline
FROM opportunities
WHERE type = 'scholarship'
  AND deadline LIKE '%2026%'
  AND (
    deadline LIKE '%Jan%' OR
    deadline LIKE '%Feb%' OR
    deadline LIKE '%Mar%' OR
    deadline LIKE '%Apr%' OR
    deadline LIKE '%May%'
  )
ORDER BY deadline;

-- 6. Check for any scholarships without required fields
SELECT id, title, organization, location
FROM opportunities
WHERE type = 'scholarship'
  AND (
    title IS NULL OR
    description IS NULL OR
    organization IS NULL OR
    application_url IS NULL
  );
-- Expected: 0 rows (all should have required fields)

-- 7. Find scholarships by keyword (example: "Masters")
SELECT title, organization, location, deadline
FROM opportunities
WHERE type = 'scholarship'
  AND (
    title ILIKE '%masters%' OR
    description ILIKE '%masters%' OR
    requirements ILIKE '%masters%'
  )
ORDER BY title;

-- 8. Get recently added scholarships (last 10)
SELECT title, organization, location, created_at
FROM opportunities
WHERE type = 'scholarship'
ORDER BY created_at DESC
LIMIT 10;

-- 9. Count scholarships by prestigious markers
SELECT
  COUNT(*) FILTER (WHERE title LIKE '%Gates%' OR title LIKE '%Rhodes%' OR title LIKE '%Fulbright%') as prestigious_count,
  COUNT(*) FILTER (WHERE description LIKE '%government%' OR organization LIKE '%Government%') as government_funded,
  COUNT(*) FILTER (WHERE description LIKE '%PhD%' OR requirements LIKE '%PhD%') as phd_programs,
  COUNT(*) FILTER (WHERE description LIKE '%Masters%' OR requirements LIKE '%Masters%') as masters_programs
FROM opportunities
WHERE type = 'scholarship';

-- 10. Sample 5 random scholarships to review
SELECT title, organization, location, deadline, LEFT(description, 100) as description_preview
FROM opportunities
WHERE type = 'scholarship'
ORDER BY RANDOM()
LIMIT 5;

-- 11. Check for potential duplicates by title
SELECT title, COUNT(*) as duplicate_count
FROM opportunities
WHERE type = 'scholarship'
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
-- Expected: 0 rows (no duplicates)

-- 12. Get statistics summary
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active,
  COUNT(*) FILTER (WHERE is_active = false) as inactive,
  MIN(created_at) as oldest_entry,
  MAX(created_at) as newest_entry
FROM opportunities
WHERE type = 'scholarship';
