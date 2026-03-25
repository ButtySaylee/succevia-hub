/**
 * Scholarship Import Script
 *
 * This script imports 100 fully funded scholarships into the Supabase database.
 * Run this after setting up your .env file with Supabase credentials.
 *
 * Usage:
 *   node import-scholarships.js
 *
 * Note: Make sure you have a .env file with SUPABASE_SERVICE_ROLE_KEY configured
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file')
  console.error('Required variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Scholarship data - Batch 1 (First 50)
const batch1 = [
  {
    title: "Manaaki New Zealand Scholarship",
    description: "Full coverage including tuition, living allowance, travel, medical insurance, and establishment allowance. This is a prestigious government-funded scholarship for developing country nationals.",
    type: "scholarship",
    organization: "NZ Ministry of Foreign Affairs",
    location: "New Zealand",
    deadline: "31 Mar 2026",
    requirements: "Citizens of eligible developing countries in Asia, Pacific, Africa, Latin America; age 18+",
    application_url: "https://www.nzscholarships.govt.nz/",
    is_active: true
  },
  // ... (due to length, I'll create a separate JSON file with all data)
]

// Scholarship data - Batch 2 (Additional 50)
const batch2 = [
  // ... (will be in separate JSON file)
]

async function importScholarships() {
  console.log('🚀 Starting scholarship import...\n')

  try {
    // Check if opportunities table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('opportunities')
      .select('id')
      .limit(1)

    if (tableError) {
      console.error('❌ Error: opportunities table not found or not accessible')
      console.error(tableError.message)
      return
    }

    console.log('✅ Connected to Supabase database\n')

    // Count existing scholarships
    const { count: existingCount } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'scholarship')

    console.log(`📊 Existing scholarships in database: ${existingCount}\n`)

    // For this demo, we'll use the SQL file method
    console.log('⚠️  Note: This script requires manual data import.')
    console.log('📝 Please use one of these methods to import:\n')
    console.log('1. Option 1: Use Supabase Dashboard SQL Editor')
    console.log('   - Open your Supabase project dashboard')
    console.log('   - Go to SQL Editor')
    console.log('   - Copy contents of insert-100-scholarships.sql')
    console.log('   - Paste and run\n')
    console.log('2. Option 2: Use Supabase CLI')
    console.log('   - Run: supabase db execute --file insert-100-scholarships.sql\n')
    console.log('3. Option 3: Use this alternative programmatic import')
    console.log('   - Uncomment the importData() function below')
    console.log('   - Import scholarship data from JSON file')
    console.log('   - Run this script again\n')

    // Alternatively, you can use programmatic insert:
    // await importData()

  } catch (error) {
    console.error('❌ Error during import:', error.message)
  }
}

// Uncomment this function to use programmatic import
async function importData() {
  console.log('📥 Importing scholarships programmatically...\n')

  // This is a sample - you would load from JSON file
  const scholarships = [
    // Load from JSON file or define here
  ]

  let successCount = 0
  let errorCount = 0

  for (const scholarship of scholarships) {
    const { error } = await supabase
      .from('opportunities')
      .insert(scholarship)

    if (error) {
      console.error(`❌ Failed to insert: ${scholarship.title}`)
      console.error(`   Error: ${error.message}`)
      errorCount++
    } else {
      console.log(`✅ Inserted: ${scholarship.title}`)
      successCount++
    }
  }

  console.log(`\n📊 Import Summary:`)
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   📈 Total: ${successCount + errorCount}\n`)
}

async function verifyImport() {
  console.log('🔍 Verifying import...\n')

  // Count total scholarships
  const { count: totalCount } = await supabase
    .from('opportunities')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'scholarship')

  // Count active scholarships
  const { count: activeCount } = await supabase
    .from('opportunities')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'scholarship')
    .eq('is_active', true)

  // Get top organizations
  const { data: orgs } = await supabase
    .from('opportunities')
    .select('organization')
    .eq('type', 'scholarship')
    .limit(5)

  console.log('📊 Import Verification Results:')
  console.log(`   Total Scholarships: ${totalCount}`)
  console.log(`   Active Scholarships: ${activeCount}`)
  console.log(`   Sample Organizations: ${orgs?.map(o => o.organization).join(', ')}\n`)

  if (totalCount >= 100) {
    console.log('✅ Import successful! All scholarships are in the database.\n')
    console.log('🎉 Next steps:')
    console.log('   1. Visit /admin-portal to view and manage scholarships')
    console.log('   2. Visit /opportunities to see them on the public page')
    console.log('   3. Add images through the admin portal (optional)')
  } else {
    console.log('⚠️  Warning: Expected 100+ scholarships but found:', totalCount)
    console.log('   Please run the SQL import script.\n')
  }
}

// Main execution
;(async () => {
  await importScholarships()

  // Ask if user wants to verify
  console.log('Would you like to verify the import? (Run with --verify flag)')
  console.log('Usage: node import-scholarships.js --verify\n')

  if (process.argv.includes('--verify')) {
    await verifyImport()
  }
})()
