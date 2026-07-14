const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = XLSX.readFile(r'C:\Users\Hp\Downloads\scholarships_v2 (@timmysofine).xlsx');

// Sheet 1: Scholarships
const ws1 = workbook.Sheets['Scholarships Database'];
const schData = XLSX.utils.sheet_to_json(ws1, { defval: '', range: 2 }); // start from row 3 (0-indexed row 2)
fs.writeFileSync(path.join(__dirname, 'scholarships.json'), JSON.stringify(schData, null, 2));
console.log(`Scholarships: ${schData.length} records written`);

// Print first 3
schData.slice(0, 5).forEach((r, i) => {
  console.log(`\nScholarship ${i+1}:`, JSON.stringify(r).slice(0, 300));
});

// Sheet 2: RA/TA/PhD
const ws2 = workbook.Sheets['RA • TA • PhD Positions'];
const jobData = XLSX.utils.sheet_to_json(ws2, { defval: '', range: 2 });
fs.writeFileSync(path.join(__dirname, 'jobs.json'), JSON.stringify(jobData, null, 2));
console.log(`\n\nRA/TA/PhD: ${jobData.length} records written`);

jobData.slice(0, 5).forEach((r, i) => {
  console.log(`\nJob ${i+1}:`, JSON.stringify(r).slice(0, 300));
});