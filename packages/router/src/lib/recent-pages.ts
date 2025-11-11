/**
 * Utility for tracking recently visited pages in localStorage
 */

const RECENT_PAGES_KEY = "nouvelle_recent_pages";
const MAX_RECENT_PAGES = 20;

export interface RecentPageEntry {
  pageId: string;
  title: string;
  icon?: string;
  lastVisited: number;
}

/**
 * Get recently visited pages from localStorage
 */
export function getRecentPages(): RecentPageEntry[] {
  try {
    const stored = localStorage.getItem(RECENT_PAGES_KEY);
    if (!stored) return [];

    const pages = JSON.parse(stored) as RecentPageEntry[];
    // Sort by lastVisited descending (most recent first)
    return pages.sort((a, b) => b.lastVisited - a.lastVisited);
  } catch (error) {
    console.error("Error reading recent pages from localStorage:", error);
    return [];
  }
}

/**
 * Track a page visit in localStorage
 */
export function trackPageVisit(pageId: string, title: string, icon?: string): void {
  try {
    const recentPages = getRecentPages();
    const now = Date.now();

    // Remove existing entry for this page (if any)
    const filtered = recentPages.filter(p => p.pageId !== pageId);

    // Add new entry at the front
    const updated: RecentPageEntry[] = [
      { pageId, title, icon, lastVisited: now },
      ...filtered,
    ];

    // Keep only the most recent MAX_RECENT_PAGES
    const trimmed = updated.slice(0, MAX_RECENT_PAGES);

    localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Error tracking page visit in localStorage:", error);
  }
}

/**
 * Clear all recent pages from localStorage
 */
export function clearRecentPages(): void {
  try {
    localStorage.removeItem(RECENT_PAGES_KEY);
  } catch (error) {
    console.error("Error clearing recent pages from localStorage:", error);
  }
}
