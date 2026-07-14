import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qiqecvcmmkemracpuawj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcWVjdmNtbWtlbXJhY3B1YXdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc5NDk1MSwiZXhwIjoyMDg4MzcwOTUxfQ.5g_p9IOq_F6pJ9Pqh0ybfndLNu_VArc1AF3fxKCNqnA';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// First, get all existing scholarship titles from the database
const { data: existing, error: fetchError } = await supabase
  .from('opportunities')
  .select('id, title, organization, application_url')
  .eq('type', 'scholarship');

if (fetchError) {
  console.error('Error fetching existing scholarships:', fetchError.message);
  process.exit(1);
}

console.log(`Found ${existing.length} existing scholarships in database\n`);

// Print all existing titles for reference
for (const s of existing) {
  console.log(`  [DB] "${s.title}" | ${s.organization}`);
}

// Build lookup sets
const existingTitles = new Set();
const existingUrls = new Set();
for (const s of existing) {
  const t = s.title.toLowerCase().trim().replace(/\s+/g, ' ');
  existingTitles.add(t);
  
  // Add simplified version without years/parentheses
  const simplified = t.replace(/\([^)]*\)/g, '').replace(/\b20\d{2}\b/g, '').replace(/\s+/g, ' ').trim();
  existingTitles.add(simplified);
  
  if (s.application_url) {
    existingUrls.add(s.application_url.toLowerCase().trim().replace(/\/+$/, ''));
  }
}

console.log('\n' + '='.repeat(60));
console.log('CHECKING WHICH EXCEL SCHOLARSHIPS ARE NEW');
console.log('='.repeat(60) + '\n');

// Define all potential scholarships from Excel (title only for checking)
const excelScholarships = [
  'Chevening Scholarship',
  'Fulbright Foreign Student Program',
  'DAAD Scholarship (Germany)',
  'MEXT Scholarship (Japan)',
  'Chinese Government Scholarship (CSC)',
  'Commonwealth Scholarship (UK)',
  'Erasmus Mundus Joint Masters (EMJM)',
  'Rhodes Scholarship (Oxford)',
  'Mastercard Foundation Scholars Program',
  'Australia Awards Scholarships',
  'Swiss Government Excellence Scholarships',
  'Türkiye Bursları (Turkish Govt Scholarship)',
  'Stipendium Hungaricum (Hungary)',
  'Netherlands Orange Knowledge Programme',
  'Gates Cambridge Scholarship',
  'Knight-Hennessy Scholars (Stanford)',
  'MTN Foundation Science & Technology Scholarship',
  'NNPC/SNEPCo National University Scholarship',
  'PTDF Scholarship',
  'NLNG Undergraduate Scholarship',
  'Jim Ovia Foundation Scholarship',
  'NHEF Scholars Program',
  'Warwick-GREAT Scholarship (Nigeria)',
  'University of Manchester Global Futures Scholarship',
  'Ban Ki-moon Foundation Global Citizen Scholarship 2026',
  'DSM-Firmenich Progress Foundation Scholarship (OYW 2026)',
  'Hauwa Ojeifo Scholarship (OYW 2026)',
  'UCL Fully Funded PhD Studentships 2026/27',
  'University of Copenhagen PhD Positions 2026',
  'Italian Government Scholarships 2026–2027'
];

for (const name of excelScholarships) {
  const normalized = name.toLowerCase().trim().replace(/\s+/g, ' ');
  const simplified = normalized.replace(/\([^)]*\)/g, '').replace(/\b20\d{2}\b/g, '').replace(/\s+/g, ' ').trim();
  
  if (existingTitles.has(normalized) || existingTitles.has(simplified)) {
    console.log(`  EXISTS: "${name}"`);
  } else {
    console.log(`  *** NEW: "${name}"`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('INSERTING TRULY NEW SCHOLARSHIPS');
console.log('='.repeat(60) + '\n');

// Only these scholarships are confirmed as NOT existing in DB
const scholarshipsToInsert = [
  {
    title: 'Erasmus Mundus Joint Masters (EMJM)',
    description: 'Coverage: Tuition waived, ~€1,000/mo living, travel, health insurance. Level: Masters. Field: Various; specific per programme. Eligible: All countries globally. Study across 2–3 European countries.',
    organization: 'European Commission',
    location: 'Europe (2+ countries)',
    deadline: 'Late 2025/early 2026 per programme',
    requirements: 'Bachelors, strong academics; Eligible countries: All countries globally',
    application_url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en'
  },
  {
    title: 'Swiss Government Excellence Scholarships',
    description: 'Coverage: CHF 1,920/mo, tuition waived, health insurance, housing, airfare. Level: Masters / PhD / Postdoc. Field: Research-oriented subjects. Eligible: Selected countries (bilateral agreements). Apply through Swiss embassy.',
    organization: 'Swiss Confederation',
    location: 'Switzerland',
    deadline: 'Country-specific (Nov–Feb)',
    requirements: 'Masters/PhD level record; Eligible countries: Selected countries (bilateral agreements)',
    application_url: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html'
  },
  {
    title: 'MTN Foundation Science & Technology Scholarship',
    description: 'Coverage: Tuition, stipend, book allowance, laptop. Level: Undergraduate (300 level). Field: STEM-related courses. Eligible: Nigeria.',
    organization: 'MTN Nigeria Foundation',
    location: 'Nigeria',
    deadline: 'Expected June–July 2026',
    requirements: 'Full-time 300-level student in STEM; Eligible countries: Nigeria',
    application_url: 'https://www.mtnfoundation.com.ng'
  },
  {
    title: 'NNPC/SNEPCo National University Scholarship',
    description: 'Coverage: Tuition, accommodation, laptop, book grant, living stipend. Level: Undergraduate. Field: All courses. Eligible: Nigeria.',
    organization: 'NNPC / Shell Nigeria (SNEPCo)',
    location: 'Nigeria',
    deadline: 'Expected July–August 2026',
    requirements: 'Full-time Nigerian undergraduates; Eligible countries: Nigeria',
    application_url: 'https://www.shellinnigeria.com/scholarships'
  },
  {
    title: 'Jim Ovia Foundation Scholarship',
    description: 'Coverage: Full tuition, laptop, stipend, mentorship. Level: Undergraduate. Field: All courses. Eligible: Nigeria. Must be in public university.',
    organization: 'Jim Ovia Foundation',
    location: 'Nigeria',
    deadline: 'Mid-year (check website)',
    requirements: 'Nigerian undergraduate in public university; Eligible countries: Nigeria',
    application_url: 'https://jimovia.org/scholarship/'
  },
  {
    title: 'University of Manchester Global Futures Scholarship',
    description: 'Coverage: £2,000–£5,000 tuition reduction. Level: UG / Masters. Field: All subjects. Eligible: Nigeria.',
    organization: 'University of Manchester',
    location: 'United Kingdom',
    deadline: 'April 23, 2026 (Masters)',
    requirements: 'Nigerian national; Eligible countries: Nigeria',
    application_url: 'https://www.manchester.ac.uk/study/international/country-specific-information/nigeria/scholarships/'
  },
  {
    title: 'Ban Ki-moon Foundation Global Citizen Scholarship 2026',
    description: 'Coverage: Full participation, travel, accommodation. Level: All levels (young leaders). Field: Global affairs/leadership. Eligible: All countries; under 35 years.',
    organization: 'Ban Ki-moon Foundation',
    location: 'Various (conference/programme)',
    deadline: 'Check current cycle',
    requirements: 'Under 35 years; Eligible countries: All countries',
    application_url: 'https://bankimoon.foundation/'
  },
  {
    title: 'DSM-Firmenich Progress Foundation Scholarship (OYW 2026)',
    description: 'Coverage: Full ticket to One Young World Summit, travel, accommodation. Level: Young entrepreneurs (all levels). Field: Business / entrepreneurship. Eligible: Developing countries.',
    organization: 'DSM-Firmenich',
    location: 'South Africa (Cape Town summit)',
    deadline: 'March 23, 2026',
    requirements: 'Young entrepreneurs 18–30; Eligible countries: Developing countries',
    application_url: 'https://www.oneyoungworld.com/scholarships'
  },
  {
    title: 'UCL Fully Funded PhD Studentships 2026/27',
    description: 'Coverage: Full tuition, London living stipend (~£20,000/yr). Level: PhD. Field: Various; check UCL faculty pages. Eligible: All nationalities.',
    organization: 'University College London',
    location: 'United Kingdom',
    deadline: 'Rolling (check UCL website)',
    requirements: 'Masters degree, research proposal; Eligible countries: All nationalities',
    application_url: 'https://www.ucl.ac.uk/scholarships/doctoral-scholarships'
  },
  {
    title: 'University of Copenhagen PhD Positions 2026',
    description: 'Coverage: Salary-based (~€4,000–€5,000/mo gross). Level: PhD. Field: Various; check UCPH vacancies. Eligible: All nationalities.',
    organization: 'University of Copenhagen (UCPH)',
    location: 'Denmark',
    deadline: 'Rolling; check UCPH vacancies portal',
    requirements: 'Masters degree; Eligible countries: All nationalities',
    application_url: 'https://employment.ku.dk/phd/'
  },
  {
    title: 'Stipendium Hungaricum (Hungary)',
    description: 'Coverage: Full tuition, monthly stipend (HUF 43K–140K), accommodation, health insurance. Level: UG / Masters / PhD. Field: Most fields. Eligible: ~70+ partner countries.',
    organization: 'Government of Hungary',
    location: 'Hungary',
    deadline: '~Jan–Feb annually',
    requirements: 'Varies by country and level; Eligible countries: ~70+ partner countries',
    application_url: 'https://stipendiumhungaricum.hu'
  },
  {
    title: 'PTDF Scholarship',
    description: 'Coverage: Full tuition, living stipend, book allowance, travel. Level: UG / Postgraduate. Field: Engineering, Geosciences, Management, Law (oil & gas). Eligible: Nigeria.',
    organization: 'Petroleum Technology Development Fund',
    location: 'Nigeria / Abroad',
    deadline: 'Mid-year (check PTDF portal)',
    requirements: 'Nigerian citizen; Eligible countries: Nigeria',
    application_url: 'https://ptdf.gov.ng/scholarship/'
  },
  {
    title: 'NLNG Undergraduate Scholarship',
    description: 'Coverage: Full tuition, laptop, book grants, stipend. Level: Undergraduate (100 level ONLY). Field: All courses. Eligible: Nigeria.',
    organization: 'Nigeria LNG Limited',
    location: 'Nigeria',
    deadline: 'Expected Oct–Dec 2026',
    requirements: '100-level Nigerian university student; Eligible countries: Nigeria',
    application_url: 'https://www.nlng.com/scholarships'
  },
  {
    title: 'NHEF Scholars Program',
    description: 'Coverage: Full tuition, laptop, mentorship, internship placement, career support. Level: Undergraduate (penultimate year). Field: All subjects. Eligible: Nigeria.',
    organization: 'Nigeria Higher Education Foundation',
    location: 'Nigeria',
    deadline: 'March 13, 2026',
    requirements: 'Penultimate year Nigerian undergraduates; Eligible countries: Nigeria',
    application_url: 'https://nhef.org/scholars-program/'
  },
  {
    title: 'Warwick-GREAT Scholarship (Nigeria)',
    description: 'Coverage: £10,000–£15,000 tuition reduction. Level: Masters (taught). Field: All subjects. Eligible: Nigeria.',
    organization: 'University of Warwick + British Council',
    location: 'United Kingdom',
    deadline: 'April 22, 2026',
    requirements: 'Nigerian national; Eligible countries: Nigeria',
    application_url: 'https://warwick.ac.uk/study/international/admissions/scholarships/great-scholarships/'
  },
  {
    title: 'Hauwa Ojeifo Scholarship (OYW 2026)',
    description: 'Coverage: Full ticket to One Young World Summit, travel, accommodation. Level: Women leaders (all levels). Field: Mental health advocacy / women\'s rights. Eligible: Africa.',
    organization: 'Hauwa Ojeifo / One Young World',
    location: 'South Africa (Cape Town summit)',
    deadline: 'March 27, 2026',
    requirements: 'Women aged 18–30; mental health advocacy focus; Eligible countries: Africa',
    application_url: 'https://www.oneyoungworld.com/scholarships'
  },
  {
    title: 'Italian Government Scholarships 2026–2027',
    description: 'Coverage: Tuition waiver, €900–€1,100/mo stipend, health insurance. Level: UG / Masters / PhD / Research. Field: All subjects. Eligible: Selected countries (Africa, Asia, Latin America, Eastern Europe).',
    organization: 'Italian Ministry of Foreign Affairs (MAECI)',
    location: 'Italy',
    deadline: 'Varies; check Italian embassy / MAECI portal',
    requirements: 'Varies by level and country; Eligible countries: Selected countries',
    application_url: 'https://www.esteri.it/en/opportunita/borse-di-studio/per-stranieri/'
  }
];

let successCount = 0;
let skipCount = 0;
let failCount = 0;

for (let i = 0; i < scholarshipsToInsert.length; i++) {
  const s = scholarshipsToInsert[i];
  
  // Final duplicate check
  const normalized = s.title.toLowerCase().trim().replace(/\s+/g, ' ');
  const simplified = normalized.replace(/\([^)]*\)/g, '').replace(/\b20\d{2}\b/g, '').replace(/\s+/g, ' ').trim();
  const url = s.application_url.toLowerCase().trim().replace(/\/+$/, '');
  
  if (existingTitles.has(normalized) || existingTitles.has(simplified)) {
    console.log(`[${i + 1}] SKIP - Already exists: "${s.title}"`);
    skipCount++;
    continue;
  }
  
  if (existingUrls.has(url)) {
    console.log(`[${i + 1}] SKIP - URL already exists: "${s.title}"`);
    skipCount++;
    continue;
  }
  
  // Insert WITHOUT is_visible since the column doesn't exist
  const { error } = await supabase
    .from('opportunities')
    .insert({
      title: s.title,
      description: s.description,
      type: 'scholarship',
      organization: s.organization,
      location: s.location,
      deadline: s.deadline,
      requirements: s.requirements,
      application_url: s.application_url,
      is_active: true
    });
  
  if (error) {
    console.log(`[${i + 1}] FAIL - "${s.title}": ${error.message}`);
    failCount++;
  } else {
    console.log(`[${i + 1}] OK - "${s.title}"`);
    successCount++;
  }
}

console.log('\n========================================');
console.log(`SUMMARY: ${successCount} inserted, ${skipCount} skipped, ${failCount} failed`);
console.log('========================================');