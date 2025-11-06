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
          parentPageId: undefined,
          isFavorite: false,
          isArchived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "3",
          workspaceId: activeWorkspace.id,
          title: "Meeting Notes",
          icon: "📅",
          parentPageId: "2",
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

      try {
        // TODO: Replace with actual API call
        console.log("Toggling favorite:", { pageId });

        // Mock success for now
        await loadPages();
        return { success: true };
      } catch (error) {
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
