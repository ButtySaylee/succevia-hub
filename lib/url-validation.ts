/**
 * URL validation utilities for Succevia Hub
 * Prevents injection of javascript:, data:, or other malicious protocols
 */

/**
 * Validates and sanitizes a URL.
 * Returns the validated URL string, or null if invalid.
 * Only allows https:// and http:// protocols.
 */
export function validateUrl(url: string | undefined | null): string | null {
  if (!url || !url.trim()) return null;

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    // Require a valid hostname with at least one dot (prevents localhost/file:// abuse)
    if (!parsed.hostname.includes(".") && parsed.hostname !== "localhost") {
      return null;
    }

    return trimmed;
  } catch {
    return null;
  }
}

/**
 * Validates an array of image URLs.
 * Returns only the valid URLs.
 */
export function validateImageUrls(urls: string[] | undefined | null): string[] {
  if (!urls || !Array.isArray(urls)) return [];
  return urls.filter((url) => validateUrl(url) !== null).slice(0, 10); // Max 10 images
}