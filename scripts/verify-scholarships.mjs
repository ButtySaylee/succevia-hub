import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qiqecvcmmkemracpuawj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcWVjdmNtbWtlbXJhY3B1YXdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc5NDk1MSwiZXhwIjoyMDg4MzcwOTUxfQ.5g_p9IOq_F6pJ9Pqh0ybfndLNu_VArc1AF3fxKCNqnA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { data, error, count } = await supabase
  .from('opportunities')
  .select('id, title, type', { count: 'exact' })
  .eq('type', 'scholarship');

if (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

console.log('Total scholarships in database:', count || data.length);
console.log();

// Check for the newly inserted ones
const newOnes = [
  'Erasmus Mundus Joint Masters (EMJM)',
  'Swiss Government Excellence Scholarships',
  'MTN Foundation Science & Technology Scholarship',
  'NNPC/SNEPCo National University Scholarship',
  'Jim Ovia Foundation Scholarship',
  'University of Manchester Global Futures Scholarship',
  'Ban Ki-moon Foundation Global Citizen Scholarship 2026',
  'DSM-Firmenich Progress Foundation Scholarship (OYW 2026)',
  'UCL Fully Funded PhD Studentships 2026/27',
  'University of Copenhagen PhD Positions 2026',
  'Stipendium Hungaricum (Hungary)',
  'PTDF Scholarship',
  'NLNG Undergraduate Scholarship',
  'NHEF Scholars Program',
  'Warwick-GREAT Scholarship (Nigeria)',
  'Hauwa Ojeifo Scholarship (OYW 2026)',
  'Italian Government Scholarships 2026\u20132027'
];

console.log('Newly inserted scholarships check:');
let verified = 0;
let missing = 0;
const dbTitles = new Set(data.map(s => s.title));

for (const title of newOnes) {
  if (dbTitles.has(title)) {
    console.log('  \u2705', title);
    verified++;
  } else {
    console.log('  \u274C', title);
    missing++;
  }
}

console.log();
console.log(`Verified: ${verified}/${newOnes.length} new scholarships in database`);