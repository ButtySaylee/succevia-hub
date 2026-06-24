// Test script to verify deadline parsing
// Run with: node scripts/test-deadline-parser.mjs

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function parseDeadlineToDate(deadline) {
  if (!deadline) return null;

  const trimmed = deadline.trim();
  
  const monthIndex = MONTH_ORDER.findIndex(m => trimmed.startsWith(m));
  if (monthIndex === -1) return null;

  const rest = trimmed.slice(MONTH_ORDER[monthIndex].length).trim();
  const cleaned = rest.replace(/^,/, "").trim();
  
  const parts = cleaned.split(/\s+/);
  if (parts.length < 2) return null;

  // Remove commas from day
  const day = parseInt(parts[0].replace(/,/g, ""), 10);
  const year = parseInt(parts[parts.length - 1], 10);

  if (isNaN(day) || isNaN(year)) return null;

  return new Date(year, monthIndex, day);
}

function isDeadlineExpired(deadline) {
  const date = parseDeadlineToDate(deadline);
  if (!date) return false;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return date < now;
}

// Test cases
const testDeadlines = [
  "February 20, 2026",
  "March 31, 2026",
  "April 30, 2026",
  "May 1, 2026",
  "May 15, 2026",
  "May 31, 2026",
  "June 30, 2026",
  "August 1, 2026",
  "October 31, 2026",
  "November 2, 2026",
  "December 15, 2026",
  "Rolling deadline",
  "Check program deadline",
  "",
  undefined
];

console.log("Today is:", new Date().toDateString());
console.log("=".repeat(50));

for (const deadline of testDeadlines) {
  const date = parseDeadlineToDate(deadline);
  const expired = isDeadlineExpired(deadline);
  console.log(
    `"${deadline ?? "null"}" -> ${date ? date.toDateString() : "null"} ${expired ? "✅ EXPIRED" : "❌ ACTIVE"}`
  );
}