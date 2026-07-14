// Run this script to add the missing image_urls column
// Usage: node scripts/add-image-columns.mjs

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qiqecvcmmkemracpuawj.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcWVjdmNtbWtlbXJhY3B1YXdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc5NDk1MSwiZXhwIjoyMDg4MzcwOTUxfQ.5g_p9IOq_F6pJ9Pqh0ybfndLNu_VArc1AF3fxKCNqnA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function migrate() {
  console.log('🔧 Adding missing columns to service_requests table...\n');
  
  // Test 1: Try Supabase's internal SQL execution via auth schema
  // This is a Postgres function that can run DDL
  
  const sqlCommands = [
    `ALTER TABLE IF EXISTS service_requests ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}'`,
    `ALTER TABLE IF EXISTS service_requests ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true`,
  ];
  
  // Approach: Use the pg_dump endpoint or direct SQL endpoint
  // Supabase exposes /rest/v1/ with the ability to call functions
  // But for DDL we need the management API or direct pg connection
  
  // Try using the supabase internal function pgmoon or exec
  const { error } = await supabase.rpc('exec_sql', { query: sqlCommands[0] });
  
  if (error && error.message?.includes('function "exec_sql" does not exist')) {
    console.log('ℹ️  exec_sql function not available, trying Management API...');
    
    // Try using direct fetch to the Management API
    // The Supabase management API allows running SQL queries
    const mgmtResponse = await fetch('https://api.supabase.com/v1/projects/qiqecvcmmkemracpuawj/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        query: sqlCommands.join(';\n') + ';'
      })
    });
    
    if (mgmtResponse.ok) {
      const result = await mgmtResponse.text();
      console.log('✅ Migration successful via Management API!');
      console.log('Result:', result);
    } else {
      const mgmtError = await mgmtResponse.text();
      console.log('❌ Management API error:', mgmtError.substring(0, 200));
      console.log('\n⚠️  Could not run DDL commands via API.');
      console.log('Please run the following SQL manually in your Supabase dashboard SQL Editor:\n');
      console.log(sqlCommands.join(';\n') + ';');
    }
  } else if (error) {
    console.log('❌ Error running SQL:', error.message);
  } else {
    console.log('✅ SQL executed successfully!');
  }
  
  // Verify
  console.log('\n🔍 Verifying columns exist...');
  const { data, error: selError } = await supabase
    .from('service_requests')
    .select('image_urls, is_visible')
    .limit(1);
    
  if (selError) {
    console.log('❌ Verification failed:', selError.message);
  } else {
    console.log('✅ image_urls column is accessible!');
  }
}

migrate().catch(console.error);