import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./auth-context";
import { useWorkspace } from "./workspace-context";

export interface Page {
  id: string;
  title: string;
  icon?: string;
  isFavorite?: boolean;
  visibility?: "private" | "workspace" | "public";
  hasChildren?: boolean;
  children?: Page[];
}

interface PageContextValue {
  pages: Page[];
  favorites: Page[];
  recent: Page[];
  isLoading: boolean;
  error: string | null;
  createPage: (
    title: string,
    parentId?: string,
    icon?: string
  ) => Promise<{ success: boolean; pageId?: string; error?: string }>;
  updatePage: (
    pageId: string,
    updates: Partial<Page>
  ) => Promise<{ success: boolean; error?: string }>;
  deletePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
  toggleFavorite: (
    pageId: string
  ) => Promise<{ success: boolean; error?: string }>;
  archivePage: (
    pageId: string
  ) => Promise<{ success: boolean; error?: string }>;
  restorePage: (
    pageId: string
  ) => Promise<{ success: boolean; error?: string }>;
  duplicatePage: (
    pageId: string
  ) => Promise<{ success: boolean; pageId?: string; error?: string }>;
  copyPageLink: (
    pageId: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshPages: () => Promise<void>;
  clearError: () => void;
}

const PageContext = createContext<PageContextValue | undefined>(undefined);

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function PageProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const { activeWorkspace } = useWorkspace();

  const [state, setState] = useState<{
    pages: Page[];
    favorites: Page[];
    recent: Page[];
    isLoading: boolean;
    error: string | null;
  }>({
    pages: [],
    favorites: [],
    recent: [],
    isLoading: true,
    error: null,
  });

  // Build tree structure from flat list of pages
  const buildTree = useCallback((pages: any[]): Page[] => {
    const pageMap = new Map<string, Page>();
    const rootPages: Page[] = [];

    // First pass: create all page objects
    pages.forEach((page) => {
      pageMap.set(page.id, {
        id: page.id,
        title: page.title,
        icon: page.icon,
        isFavorite: page.isFavorite,
        visibility: page.visibility,
        hasChildren: false,
        children: [],
      });
    });

    // Second pass: build tree structure
    pages.forEach((page) => {
      const pageNode = pageMap.get(page.id);
      if (!pageNode) return;

      if (page.parentPageId) {
        const parent = pageMap.get(page.parentPageId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(pageNode);
          parent.hasChildren = true;
        }
      } else {
        rootPages.push(pageNode);
      }
    });

    return rootPages;
  }, []);

  // Load pages from API
  const loadPages = useCallback(async () => {
    if (!token || !isAuthenticated || !activeWorkspace) {
      setState({
        pages: [],
        favorites: [],
        recent: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      // For now, we'll create mock data since the API endpoints don't exist yet
      // TODO: Replace with actual API calls when backend is ready
      const mockPages: any[] = [
        {
          id: "1",
          workspaceId: activeWorkspace.id,
          title: "Getting Started",
          icon: "📝",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "2",
          workspaceId: activeWorkspace.id,
          title: "Project Planning",
          icon: "📋",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "3",
          workspaceId: activeWorkspace.id,
          title: "Meeting Notes",
          icon: "📅",
          visibility: "private",
          parentPageId: "2",
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "4",
          workspaceId: activeWorkspace.id,
          title: "Design System",
          icon: "🎨",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "5",
          workspaceId: activeWorkspace.id,
          title: "Engineering Docs",
          icon: "⚙️",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "6",
          workspaceId: activeWorkspace.id,
          title: "Product Roadmap",
          icon: "🗺️",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "7",
          workspaceId: activeWorkspace.id,
          title: "Team Handbook",
          icon: "📖",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "8",
          workspaceId: activeWorkspace.id,
          title: "Marketing Plans",
          icon: "📊",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "9",
          workspaceId: activeWorkspace.id,
          title: "Customer Research",
          icon: "🔍",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "10",
          workspaceId: activeWorkspace.id,
          title: "Sprint Planning",
          icon: "🏃",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "11",
          workspaceId: activeWorkspace.id,
          title: "Performance Metrics",
          icon: "📈",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "12",
          workspaceId: activeWorkspace.id,
          title: "Tech Stack",
          icon: "💻",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "13",
          workspaceId: activeWorkspace.id,
          title: "Budget 2024",
          icon: "💰",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "14",
          workspaceId: activeWorkspace.id,
          title: "Company Values",
          icon: "💎",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: true,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "15",
          workspaceId: activeWorkspace.id,
          title: "Onboarding Guide",
          icon: "🎓",
          visibility: "private",
          parentPageId: undefined,
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      const tree = buildTree(mockPages);
      const favs = mockPages.filter((p) => p.isFavorite);
      const recentPages = mockPages.slice(0, 5);

      setState({
        pages: tree,
        favorites: buildTree(favs),
        recent: buildTree(recentPages),
        isLoading: false,
        error: null,
      });

      /* 
      // Uncomment when API endpoints are ready:
      const [pagesRes, favsRes, recentRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/workspaces/${activeWorkspace.id}/pages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/workspaces/${activeWorkspace.id}/pages/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/api/workspaces/${activeWorkspace.id}/pages/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [pagesData, favsData, recentData] = await Promise.all([
        pagesRes.json(),
        favsRes.json(),
        recentRes.json(),
      ]);

      const tree = buildTree(pagesData.pages || []);
      const favs = buildTree(favsData.pages || []);
      const recent = buildTree(recentData.pages || []);

      setState({
        pages: tree,
        favorites: favs,
        recent: recent,
        isLoading: false,
        error: null,
      });
      */
    } catch (error) {
      console.error("Load pages error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load pages",
      }));
    }
  }, [token, isAuthenticated, activeWorkspace, buildTree]);

  // Create new page
  const createPage = useCallback(
    async (
      title: string,
      parentId?: string,
      icon?: string
    ): Promise<{ success: boolean; pageId?: string; error?: string }> => {
      if (!token || !activeWorkspace) {
        return { success: false, error: "Not authenticated" };
      }

      try {
        // TODO: Replace with actual API call
        console.log("Creating page:", {
          title,
          parentId,
          icon,
          workspaceId: activeWorkspace.id,
        });

        // Mock success for now
        await loadPages();
        return { success: true, pageId: Date.now().toString() };

        /*
      const response = await fetch(`${API_BASE_URL}/api/workspaces/${activeWorkspace.id}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, parentId, icon }),
      });

      const data = await response.json();

      if (data.success) {
        await loadPages();
        return { success: true, pageId: data.pageId };
      }

      return { success: false, error: data.error || 'Failed to create page' };
      */
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to create page";
        console.error("Create page error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, activeWorkspace, loadPages]
  );

  // Update page
  const updatePage = useCallback(
    async (
      pageId: string,
      updates: Partial<Page>
    ): Promise<{ success: boolean; error?: string }> => {
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      try {
        // TODO: Replace with actual API call
        console.log("Updating page:", { pageId, updates });

        // Mock success for now
        await loadPages();
        return { success: true };

        /*
      const response = await fetch(`${API_BASE_URL}/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        await loadPages();
        return { success: true };
      }

      return { success: false, error: data.error || 'Failed to update page' };
      */
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to update page";
        console.error("Update page error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, loadPages]
  );

  // Delete page
  const deletePage = useCallback(
    async (pageId: string): Promise<{ success: boolean; error?: string }> => {
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      try {
        // TODO: Replace with actual API call
        console.log("Deleting page:", { pageId });

        // Mock success for now
        await loadPages();
        return { success: true };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to delete page";
        console.error("Delete page error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, loadPages]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (pageId: string): Promise<{ success: boolean; error?: string }> => {
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      // Optimistically update the UI immediately
      const updatePageFavoriteStatus = (
        pages: Page[],
        pageId: string
      ): Page[] => {
        return pages.map((page) => {
          if (page.id === pageId) {
            return { ...page, isFavorite: !page.isFavorite };
          }
          // Also check children recursively
          if (page.children) {
            return {
              ...page,
              children: updatePageFavoriteStatus(page.children, pageId),
            };
          }
          return page;
        });
      };

      // Update state optimistically
      setState((prev) => {
        const updatedPages = updatePageFavoriteStatus(prev.pages, pageId);

        // Rebuild favorites list from updated pages
        const flattenPages = (pages: Page[]): Page[] => {
          return pages.reduce((acc, page) => {
            acc.push(page);
            if (page.children) {
              acc.push(...flattenPages(page.children));
            }
            return acc;
          }, [] as Page[]);
        };

        const allPages = flattenPages(updatedPages);
        const newFavorites = allPages.filter((page) => page.isFavorite);

        return {
          ...prev,
          pages: updatedPages,
          favorites: newFavorites,
        };
      });

      try {
        // TODO: Replace with actual API call
        // Mock success for now - in real implementation, this would make the API call
        // If the API call fails, we should revert the optimistic update
        return { success: true };
      } catch (error) {
        // Revert the optimistic update on error
        await loadPages();
        const errorMsg =
          error instanceof Error ? error.message : "Failed to toggle favorite";
        console.error("Toggle favorite error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, loadPages]
  );

  // Archive page
  const archivePage = useCallback(
    async (pageId: string): Promise<{ success: boolean; error?: string }> => {
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      try {
        // TODO: Replace with actual API call
        console.log("Archiving page:", { pageId });

        await loadPages();
        return { success: true };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to archive page";
        console.error("Archive page error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, loadPages]
  );

  // Restore page
  const restorePage = useCallback(
    async (pageId: string): Promise<{ success: boolean; error?: string }> => {
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      try {
        // TODO: Replace with actual API call
        console.log("Restoring page:", { pageId });

        await loadPages();
        return { success: true };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to restore page";
        console.error("Restore page error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, loadPages]
  );

  // Duplicate page
  const duplicatePage = useCallback(
    async (
      pageId: string
    ): Promise<{ success: boolean; pageId?: string; error?: string }> => {
      if (!token || !activeWorkspace) {
        return { success: false, error: "Not authenticated" };
      }

      try {
        // TODO: Replace with actual API call
        console.log("Duplicating page:", { pageId });

        // Mock success for now
        await loadPages();
        return { success: true, pageId: Date.now().toString() };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to duplicate page";
        console.error("Duplicate page error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, activeWorkspace, loadPages]
  );

  // Copy page link
  const copyPageLink = useCallback(
    async (pageId: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // Generate page URL (adjust based on your routing structure)
        const pageUrl = `${window.location.origin}/page/${pageId}`;

        // Copy to clipboard
        await navigator.clipboard.writeText(pageUrl);

        console.log("Copied page link:", { pageId, url: pageUrl });
        return { success: true };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to copy link";
        console.error("Copy page link error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  // Refresh pages
  const refreshPages = useCallback(async () => {
    await loadPages();
  }, [loadPages]);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Load pages when workspace changes
  useEffect(() => {
    loadPages();
  }, [loadPages]);

  return (
    <PageContext.Provider
      value={{
        ...state,
        createPage,
        updatePage,
        deletePage,
        toggleFavorite,
        archivePage,
        restorePage,
        duplicatePage,
        copyPageLink,
        refreshPages,
        clearError,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
}
