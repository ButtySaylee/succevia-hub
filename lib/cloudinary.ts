/**
 * Optimizes Cloudinary image URLs by adding transformation parameters
 * @param url - Original Cloudinary image URL
 * @param width - Desired width (default: auto)
 * @param quality - Quality setting (default: auto)
 * @param format - Format setting (default: auto)
 * @returns Optimized Cloudinary URL
 */
export function optimizeCloudinaryUrl(
  url: string,
  width: number | "auto" = "auto",
  quality: string = "auto",
  format: string = "auto"
): string {
  if (!url || !url.includes("cloudinary.com")) return url;

  // Insert transformation parameters before /upload/
  const transformations = `w_${width},q_${quality},f_${format}`;
  return url.replace("/upload/", `/upload/${transformations}/`);
}

/**
 * Generates responsive Cloudinary URLs for different screen sizes
 * @param url - Original Cloudinary image URL
 * @returns Object with URLs for different breakpoints
 */
export function getResponsiveCloudinaryUrls(url: string) {
  return {
    thumbnail: optimizeCloudinaryUrl(url, 400, "auto", "auto"),
    card: optimizeCloudinaryUrl(url, 800, "auto", "auto"),
    detail: optimizeCloudinaryUrl(url, 1200, "auto", "auto"),
    full: optimizeCloudinaryUrl(url, 1920, "auto", "auto"),
  };
}
