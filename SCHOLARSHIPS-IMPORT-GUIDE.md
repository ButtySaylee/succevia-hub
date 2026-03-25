# How to Import 100 Fully Funded Scholarships 2026

This guide will help you add all 100 scholarships to your database and manage them through the admin portal.

## Overview

- **Total Scholarships**: 100 (50 from Batch 1 + 50 from Batch 2)
- **Source Files**:
  - `c:\Users\Hp\Downloads\fully_funded_scholarships_2026.html`
  - `c:\Users\Hp\Downloads\fully_funded_scholarships_2026_batch2.html`
- **SQL Script**: `insert-100-scholarships.sql`

## Quick Start

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to: **SQL Editor** (in the left sidebar)

2. **Run the SQL Script**
   - Click "New Query"
   - Open the file `insert-100-scholarships.sql`
   - Copy all the content
   - Paste it into the SQL editor
   - Click **RUN** button

3. **Verify Import**
   - Go to **Table Editor** > **opportunities** table
   - You should see 100 new scholarship entries
   - All should have `type = 'scholarship'` and `is_active = true`

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db execute --file insert-100-scholarships.sql
```

### Option 3: Using PostgreSQL Client

If you have direct database access:

```bash
psql "your-database-connection-string" -f insert-100-scholarships.sql
```

## What Gets Added

Each scholarship includes:
- ✅ **Title**: Scholarship name
- ✅ **Description**: Coverage details and benefits
- ✅ **Type**: Set to 'scholarship'
- ✅ **Organization**: Funding organization
- ✅ **Location**: Country/region
- ✅ **Deadline**: Application deadline
- ✅ **Requirements**: Eligibility criteria
- ✅ **Application URL**: Direct link to apply
- ✅ **Is Active**: Set to `true` (visible on the website)
- ⚠️ **Image URL**: Set to `NULL` (you can add images later via admin portal)

## Managing Scholarships

### Access Admin Portal

1. Navigate to: `http://localhost:3000/admin-portal` (or your domain)
2. Log in with your admin password
3. Click on the **"Opportunities"** tab

### Available Actions

From the admin portal, you can:

- ✏️ **Edit** - Update any scholarship details
- 👁️ **Hide/Show** - Toggle visibility without deleting
- 🗑️ **Delete** - Permanently remove a scholarship
- ➕ **Add New** - Create additional scholarships
- 🖼️ **Upload Images** - Add scholarship images via the edit form

### Filter Options

- **All Opportunities** - View all jobs and scholarships
- **Jobs Only** - View only job listings
- **Scholarships Only** - View only scholarship listings

### Statistics Dashboard

The admin portal shows:
- Total opportunities count
- Active opportunities
- Inactive opportunities

## Scholarship Details

### Batch 1 Highlights (50 Scholarships)

- **Manaaki New Zealand Scholarship** - Full funding for developing countries
- **Australia Awards** - Prestigious DFAT scholarship
- **Chinese Government Scholarship (CSC)** - Multiple levels
- **GKS Korea** - Graduate programs with language training
- **Erasmus Mundus** - European joint programs
- **DAAD Scholarships** - Multiple German programs
- **Gates Cambridge** - Elite UK scholarship
- **Rhodes Scholarship** - Oxford University
- **Fulbright Program** - US government scholarship
- **And 41 more...**

### Batch 2 Highlights (50 Scholarships)

- **EPFL Master Excellence Fellowship** - Switzerland
- **Chevening Scholarship** - UK government
- **Eiffel Excellence** - French government
- **ETH Zurich Excellence** - Top technical university
- **Rotary Peace Fellowship** - Peace and development
- **KAIST International** - Korea STEM programs
- **Islamic Development Bank** - IsDB countries
- **HKPFS Hong Kong PhD** - Research excellence
- **Orange Knowledge Programme** - Netherlands development
- **And 41 more...**

## Featured Countries/Regions

- 🇪🇺 **Europe**: 35+ scholarships (Germany, France, Switzerland, UK, Sweden, Netherlands, etc.)
- 🌏 **Asia**: 25+ scholarships (China, Korea, Japan, Singapore, India, etc.)
- 🌎 **Americas**: 10+ scholarships (USA, Canada, Brazil)
- 🌍 **Africa**: 5+ scholarships (Pan-African programs)
- 🌐 **Multi-country**: 10+ global programs
- 🇦🇺 **Oceania**: 8+ scholarships (Australia, New Zealand)
- 🇸🇦 **Middle East**: 3+ scholarships (Qatar, Saudi Arabia)

## Academic Levels Covered

- 🎓 **Bachelor's**: 5+ scholarships
- 📚 **Master's**: 60+ scholarships
- 🔬 **PhD**: 25+ scholarships
- 📖 **Multiple Levels**: 30+ scholarships
- 🏆 **Fellowships**: 5+ programs

## Verification

After importing, verify by:

1. **Check total count**:
   ```sql
   SELECT COUNT(*) FROM opportunities WHERE type = 'scholarship';
   ```
   Expected result: 100+ (including any existing scholarships)

2. **Check active scholarships**:
   ```sql
   SELECT COUNT(*) FROM opportunities WHERE type = 'scholarship' AND is_active = true;
   ```
   Expected result: 100 new scholarships

3. **View on website**:
   - Navigate to `/opportunities` page
   - Filter by "Scholarships"
   - You should see all 100 scholarships listed

4. **Test search**:
   - Search for "Germany" - should find DAAD and other German scholarships
   - Search for "Masters" - should find Master's-level scholarships
   - Search for "PhD" - should find doctoral scholarships

## Troubleshooting

### Issue: Duplicates if run multiple times

If you accidentally run the script twice, you'll get duplicate entries. To fix:

```sql
-- Find duplicates
SELECT title, COUNT(*)
FROM opportunities
WHERE type = 'scholarship'
GROUP BY title
HAVING COUNT(*) > 1;

-- Delete duplicates (keep most recent)
DELETE FROM opportunities a USING (
  SELECT MIN(created_at) as created_at, title
  FROM opportunities
  WHERE type = 'scholarship'
  GROUP BY title
  HAVING COUNT(*) > 1
) b
WHERE a.title = b.title
AND a.created_at = b.created_at;
```

### Issue: Script fails midway

The script uses multiple INSERT statements. If it fails:
1. Check which scholarships were inserted
2. Identify where it failed
3. Run only the failed portion again

### Issue: Permission denied

Make sure you're using the service role key or have proper permissions in Supabase.

## Next Steps

1. ✅ Import all 100 scholarships using this guide
2. 📸 Add scholarship images through admin portal (optional)
3. 🔍 Review and verify scholarship details
4. 📱 Test the opportunities page on mobile and desktop
5. 🔄 Regularly update deadlines as they approach
6. 🗑️ Archive expired scholarships (hide instead of delete)

## Notes

- All scholarships are set to **active** by default
- No images are included initially - add them via admin portal
- Deadlines are stored as text strings (not dates) as in original data
- All location data is preserved from source files
- Application links point to official scholarship websites
- Eligibility requirements are stored in the `requirements` field

## Support

If you encounter any issues:
1. Check the Supabase logs for error messages
2. Verify your database connection
3. Ensure the `opportunities` table schema matches the INSERT statements
4. Check the console for any JavaScript errors in the admin portal

---

**Last Updated**: March 20, 2026
**Database**: Supabase PostgreSQL
**Admin Portal**: `/admin-portal`
**Public View**: `/opportunities`
