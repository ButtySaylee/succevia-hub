// lib/opportunity-utils.ts
// Utilities for parsing opportunity deadlines and filtering expired ones

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Parse a deadline text string (e.g. "March 30, 2025") into a Date object.
 * Returns null if the deadline cannot be parsed.
 */
export function parseDeadlineToDate(deadline: string | undefined | null): Date | null {
  if (!deadline) return null;

  const trimmed = deadline.trim();
  
  // Try to match patterns like "March 30, 2025" or "March 30 2025"
  const monthIndex = MONTH_ORDER.findIndex(m => trimmed.startsWith(m));
  if (monthIndex === -1) return null;

  // Extract the rest after the month name
  const rest = trimmed.slice(MONTH_ORDER[monthIndex].length).trim();
  // Remove any trailing comma
  const cleaned = rest.replace(/^,/, "").trim();
  
  // Split by spaces to get day and year
  const parts = cleaned.split(/\s+/);
  if (parts.length < 2) return null;

  const day = parseInt(parts[0], 10);
  const year = parseInt(parts[parts.length - 1], 10);

  if (isNaN(day) || isNaN(year)) return null;

  // Month is 0-indexed in JavaScript Date
  return new Date(year, monthIndex, day);
}

/**
 * Check if a deadline has passed (is expired).
 * Returns true if the deadline exists and is before today.
 */
export function isDeadlineExpired(deadline: string | undefined | null): boolean {
  const date = parseDeadlineToDate(deadline);
  if (!date) return false; // No deadline = not expired

  const now = new Date();
  // Set to start of day for fair comparison
  now.setHours(0, 0, 0, 0);
  
  return date < now;
}

/**
 * Filter out opportunities whose deadline has passed.
 */
export function filterExpired<T extends { deadline?: string | null }>(items: T[]): T[] {
  return items.filter(item => !isDeadlineExpired(item.deadline));
}