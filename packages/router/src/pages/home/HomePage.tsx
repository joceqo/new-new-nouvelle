/**
 * Home Page - Notion-style home with dynamic greeting
 */

import { Home, type RecentPage } from "@nouvelle/ui";
import { usePage, type Page } from "../../lib/page-context";
import { useWorkspace } from "../../lib/workspace-context";
import { usePageTitle } from "../../lib/use-page-title";
import { useNavigate } from "@tanstack/react-router";
import { createPageSlug } from "../../lib/notion-url";
import { useMemo } from "react";
import { getRecentPages } from "../../lib/recent-pages";

export function HomePage() {
  const navigate = useNavigate();
  const { pages } = usePage();
  const { activeWorkspace } = useWorkspace();

  // Update browser tab title
  usePageTitle({
    title: "Home",
    icon: "🏠",
    suffix: activeWorkspace?.name,
  });

  // Get recently visited pages with smart merging
  const recentPages: RecentPage[] = useMemo(() => {
    // Flatten page tree to get ALL pages (including nested)
    const flattenPages = (pageList: Page[]): Page[] => {
      const result: Page[] = [];
      for (const page of pageList) {
        result.push(page);
        if (page.children && page.children.length > 0) {
          result.push(...flattenPages(page.children));
        }
      }
      return result;
    };

    const allPages = flattenPages(pages);
    const visitedPages = getRecentPages();

    // Create a map for quick lookup
    const pageMap = new Map(allPages.map(p => [p.id, p]));
    const result: RecentPage[] = [];
    const usedPageIds = new Set<string>();

    // 1. Add visited pages first (from localStorage)
    for (const visited of visitedPages) {
      const page = pageMap.get(visited.pageId);
      if (page && result.length < 6) {
        result.push({
          id: page.id,
          title: page.title,
          icon: page.icon,
          lastVisited: new Date(visited.lastVisited),
        });
        usedPageIds.add(page.id);
      }
    }

    // 2. Fill remaining slots with recently updated pages (if < 6)
    if (result.length < 6) {
      const recentlyUpdated = allPages
        .filter(p => !usedPageIds.has(p.id)) // Exclude already added pages
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); // Sort by updatedAt desc

      for (const page of recentlyUpdated) {
        if (result.length >= 6) break;
        result.push({
          id: page.id,
          title: page.title,
          icon: page.icon,
          lastVisited: new Date(page.updatedAt || Date.now()),
        });
      }
    }

    return result;
  }, [pages]);

  const handlePageClick = (pageId: string) => {
    // Find the page in the tree (flattened search)
    const findPageById = (pages: any[], id: string): any => {
      for (const page of pages) {
        if (page.id === id) return page;
        if (page.children) {
          const found = findPageById(page.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const page = findPageById(pages, pageId);
    if (page) {
      const slug = createPageSlug(page.title, page.id);
      navigate({ to: "/$pageSlug", params: { pageSlug: slug } });
    }
  };

  return <Home recentPages={recentPages} onPageClick={handlePageClick} />;
}
