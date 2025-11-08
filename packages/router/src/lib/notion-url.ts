/**
 * Notion-style URL utilities
 *
 * Notion URLs support two formats:
 * 1. Just the ID: /2b4b306eed8f440891cac95e1c903111
 * 2. Slug + ID: /Getting-Started-29864713e0928051ac41db65ee505
 *
 * The ID is always the last part (or the entire string if no dash)
 */

/**
 * Extract page ID from a Notion-style URL slug
 *
 * Examples:
 * - "2b4b306eed8f440891cac95e1c903111" → "2b4b306eed8f440891cac95e1c903111"
 * - "Getting-Started-29864713e0928051ac41db65ee505" → "29864713e0928051ac41db65ee505"
 * - "My-Page-Title-abc123def456" → "abc123def456"
 */
export function extractPageId(slug: string): string {
  // If the slug contains a dash, take everything after the last dash
  const lastDashIndex = slug.lastIndexOf("-");

  if (lastDashIndex === -1) {
    // No dash found, the entire slug is the ID
    return slug;
  }

  // Return everything after the last dash
  return slug.substring(lastDashIndex + 1);
}

/**
 * Create a Notion-style URL slug from a page title and ID
 *
 * Examples:
 * - ("Getting Started", "abc123") → "Getting-Started-abc123"
 * - ("My Page", "def456") → "My-Page-def456"
 * - ("", "abc123") → "abc123" (no title, just ID)
 */
export function createPageSlug(title: string, id: string): string {
  if (!title || title.trim() === "") {
    // No title, just return the ID
    return id;
  }

  // Convert title to slug format (replace spaces with dashes, remove special chars)
  const titleSlug = title
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-") // Replace multiple dashes with single dash
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes

  // Combine title slug and ID
  return `${titleSlug}-${id}`;
}

/**
 * Check if a string looks like a page ID
 * (heuristic: contains only alphanumeric characters, at least 10 chars)
 */
export function looksLikePageId(str: string): boolean {
  // Page IDs are typically long alphanumeric strings
  return /^[a-zA-Z0-9]{10,}$/.test(str);
}
