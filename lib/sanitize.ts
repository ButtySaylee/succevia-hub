/**
 * Input sanitization utilities for Succevia Hub
 * Prevents XSS attacks by stripping dangerous HTML/JS from user input
 */

/**
 * Sanitizes a text string by removing dangerous HTML/JS content.
 * Use this for all user-provided text fields (titles, descriptions, names, etc.)
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    .replace(/[<>"'\/]/g, (char) => {
      switch (char) {
        case "<": return "\\u003C";
        case ">": return "\\u003E";
        case "\"": return "\\u0022";
        case "'": return "\\u0027";
        case "/": return "\\u002F";
        default: return char;
      }
    })
    .trim();
}

/**
 * Sanitizes a text string but preserves basic HTML formatting.
 * Use ONLY when you need to allow safe HTML (e.g., descriptions with <br>, <b>, <i>)
 * Strips script tags, event handlers, and javascript: URLs.
 */
export function sanitizeRichText(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove event handlers (onclick, onload, etc.)
    .replace(/\bon\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\bon\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\bon\w+\s*=\s*[^\s>]+/gi, "")
    // Remove javascript: URLs
    .replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#blocked"')
    .replace(/src\s*=\s*["']?\s*javascript:/gi, 'src="#blocked"')
    // Remove dangerous tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .trim();
}

/**
 * Sanitizes a phone number or WhatsApp number.
 * Removes all non-digit characters except leading +.
 */
export function sanitizePhone(input: string | undefined | null): string {
  if (!input) return "";
  return String(input).replace(/[^\d+]/g, "").trim();
}

/**
 * Sanitizes a price string.
 * Removes any non-numeric characters except digits and decimal point.
 */
export function sanitizePrice(input: string | undefined | null): string {
  if (!input) return "";
  return String(input).replace(/[^\d.]/g, "").trim();
}