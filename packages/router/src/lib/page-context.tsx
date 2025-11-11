import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./auth-context";
import { useWorkspace } from "./workspace-context";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface Page {
  id: string;
  title: string;
  icon?: string;
  isFavorite?: boolean;
  visibility?: "private" | "workspace" | "public";
  hasChildren?: boolean;
  children?: Page[];
  createdAt?: number;
  updatedAt?: number;
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
      pageMap.set(page._id, {
        id: page._id,
        title: page.title,
        icon: page.icon,
        isFavorite: page.isFavorite,
        visibility: page.visibility,
        hasChildren: false,
        children: [],
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      });
    });

    // Second pass: build tree structure
    pages.forEach((page) => {
      const pageNode = pageMap.get(page._id);
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
      const [pagesRes, favsRes, recentRes] = await Promise.all([
        fetch(`${API_BASE_URL}/workspaces/${activeWorkspace.id}/pages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/workspaces/${activeWorkspace.id}/pages/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/workspaces/${activeWorkspace.id}/pages/recent`, {
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
        const response = await fetch(
          `${API_BASE_URL}/workspaces/${activeWorkspace.id}/pages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, parentId, icon }),
          }
        );

        const data = await response.json();

        if (data.success) {
          await loadPages();
          return { success: true, pageId: data.pageId };
        }

        return {
          success: false,
          error: data.error || "Failed to create page",
        };
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
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (data.success) {
          await loadPages();
          return { success: true };
        }

        return { success: false, error: data.error || "Failed to update page" };
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
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.success) {
          await loadPages();
          return { success: true };
        }

        return { success: false, error: data.error || "Failed to delete page" };
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
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/favorite`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.success) {
          await loadPages();
          return { success: true };
        }

        return {
          success: false,
          error: data.error || "Failed to toggle favorite",
        };
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
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/archive`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.success) {
          await loadPages();
          return { success: true };
        }

        return { success: false, error: data.error || "Failed to archive page" };
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
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/restore`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.success) {
          await loadPages();
          return { success: true };
        }

        return { success: false, error: data.error || "Failed to restore page" };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to restore page";
        console.error("Restore page error:", errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [token, loadPages]
  );

  // Duplicate page (not implemented in Convex yet, placeholder for now)
  const duplicatePage = useCallback(
    async (
      pageId: string
    ): Promise<{ success: boolean; pageId?: string; error?: string }> => {
      // TODO: Implement duplication in Convex backend
      console.log("Duplicating page:", { pageId });
      return {
        success: false,
        error: "Duplicate functionality not yet implemented",
      };
    },
    []
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
