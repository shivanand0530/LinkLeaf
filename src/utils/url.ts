/**
 * Extract a readable title from a URL
 * @param url The URL to extract title from
 * @returns A cleaned up title from the URL
 */
export function extractTitleFromURL(url: string): string {
  try {
    // Parse the URL
    const urlObj = new URL(url);
    
    // Remove www., .com, etc and split by remaining dots or dashes or slashes
    const parts = urlObj.hostname
      .replace(/^www\./i, '') // Remove www.
      .replace(/\.(com|org|net|io|dev|co|app)$/i, '') // Remove common TLDs
      .split(/[\.-\/]/) // Split by dots, dashes, and slashes
      .filter(Boolean); // Remove empty parts

    // Capitalize each part and join with spaces
    const title = parts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    return title || urlObj.hostname; // Fallback to hostname if we couldn't make a nice title
  } catch {
    // If URL parsing fails, return a cleaned up version of the URL
    return url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split(/[\/\?#]/)[0];
  }
}