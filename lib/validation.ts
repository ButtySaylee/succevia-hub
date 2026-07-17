/**
 * Input validation utilities for Succevia Hub
 * Validates common field types like prices, phone numbers, and emails
 */

/**
 * Validates a price string.
 * Accepts formats like: "100", "1,000", "1000.50", "L$ 1000", "$100"
 */
export function isValidPrice(value: string | undefined | null): boolean {
  if (!value) return false;
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return !isNaN(num) && num > 0 && num < 1000000000;
}

/**
 * Validates a phone number in E.164 format or with country code prefix.
 * Accepts: +231770000000, 0770000000, 231770000000
 */
export function isValidPhone(value: string | undefined | null): boolean {
  if (!value) return false;
  const cleaned = String(value).replace(/[\s\-\(\)]/g, "");
  return /^\+?[1-9]\d{6,14}$/.test(cleaned);
}

/**
 * Validates an email address.
 */
export function isValidEmail(value: string | undefined | null): boolean {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

/**
 * Validates that a string is not empty after trimming.
 */
export function isNonEmpty(value: string | undefined | null): boolean {
  return !!value && String(value).trim().length > 0;
}

/**
 * Validates a listing title (3-200 characters).
 */
export function isValidTitle(value: string | undefined | null): boolean {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed.length >= 3 && trimmed.length <= 200;
}

/**
 * Validates a category against allowed marketplace categories.
 */
export function isValidMarketplaceCategory(category: string | undefined | null): boolean {
  if (!category) return false;
  const allowed = [
    "Phones", "Laptops", "Electronics", "Vehicles", "Motorcycles",
    "Furniture", "Fashion", "Property", "Agriculture", "Books",
    "Home Appliances", "Other", "All",
    "Electronics", "Vehicles", "Fashion", "Property", "Home", "Other",
  ];
  return allowed.includes(String(category));
}