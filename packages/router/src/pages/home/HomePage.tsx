/**
 * Home Page - Notion-style home with dynamic greeting
 */

import { Home, type RecentPage } from "@nouvelle/ui";
import { usePage } from "../../lib/page-context";
import { useNavigate } from "@tanstack/react-router";
import { createPageSlug } from "../../lib/notion-url";
import { useMemo } from "react";

export function HomePage() {
  const navigate = useNavigate();
  const { pages } = usePage();

  // Get recently visited pages (mock for now - you can add real tracking later)
  const recentPages: RecentPage[] = useMemo(() => {
    // Sort pages by some criteria and take the first 6
    // For now, just take first 6 pages
    return pages.slice(0, 6).map((page) => ({
      id: page.id,
      title: page.title,
      icon: page.icon,
      lastVisited: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
    }));
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
