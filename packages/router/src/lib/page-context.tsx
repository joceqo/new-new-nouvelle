import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const { activeWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const queryClient = useQueryClient();

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

  // Query for pages - only runs when workspace is active
  const {
    data: pagesData,
    isLoading: pagesLoading,
    refetch: refetchPages,
  } = useQuery({
    queryKey: ["pages", activeWorkspace?.id],
    queryFn: async () => {
      if (!token || !isAuthenticated || !activeWorkspace) {
        console.log(
          "[PAGES] No token, not authenticated, or no active workspace"
        );
        return { pages: [], favorites: [], recent: [] };
      }

      console.log("[PAGES] Loading pages for workspace:", activeWorkspace.id);

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      try {
        // Fetch pages, favorites, and recent in parallel
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

        // Check for errors
        if (!pagesRes.ok || !favsRes.ok || !recentRes.ok) {
          throw new Error("Failed to fetch pages");
        }

        const [pagesData, favsData, recentData] = await Promise.all([
          pagesRes.json(),
          favsRes.json(),
          recentRes.json(),
        ]);

        const tree = buildTree(pagesData.pages || []);
        const favs = buildTree(favsData.pages || []);
        const recent = buildTree(recentData.pages || []);

        console.log("[PAGES] Pages loaded:", {
          count: tree.length,
          favorites: favs.length,
          recent: recent.length,
        });

        return {
          pages: tree,
          favorites: favs,
          recent: recent,
        };
      } catch (error) {
        console.error("[PAGES] Error loading pages:", error);
        return { pages: [], favorites: [], recent: [] };
      }
    },
    enabled:
      !!token &&
      isAuthenticated &&
      !!activeWorkspace &&
      !authLoading &&
      !workspaceLoading, // THIS PREVENTS THE RACE CONDITION
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createPageMutation = useMutation({
    mutationFn: async ({
      title,
      parentId,
      icon,
    }: {
      title: string;
      parentId?: string;
      icon?: string;
    }) => {
      if (!token || !activeWorkspace) throw new Error("Not authenticated");

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const response = await fetch(
        `${API_BASE_URL}/workspaces/${activeWorkspace.id}/pages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            parentId,
            icon,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create page");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({
      pageId,
      updates,
    }: {
      pageId: string;
      updates: Partial<Page>;
    }) => {
      if (!token) throw new Error("Not authenticated");

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update page");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (pageId: string) => {
      if (!token) throw new Error("Not authenticated");

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (pageId: string) => {
      if (!token) throw new Error("Not authenticated");

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/favorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const archivePageMutation = useMutation({
    mutationFn: async (pageId: string) => {
      if (!token) throw new Error("Not authenticated");

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/archive`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to archive page");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const restorePageMutation = useMutation({
    mutationFn: async (pageId: string) => {
      if (!token) throw new Error("Not authenticated");

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/restore`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to restore page");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  // Action functions
  const createPage = useCallback(
    async (title: string, parentId?: string, icon?: string) => {
      try {
        const result = await createPageMutation.mutateAsync({
          title,
          parentId,
          icon,
        });
        return result.success
          ? { success: true, pageId: result.pageId }
          : { success: false, error: "Failed to create page" };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to create page",
        };
      }
    },
    [createPageMutation]
  );

  const updatePage = useCallback(
    async (pageId: string, updates: Partial<Page>) => {
      try {
        const result = await updatePageMutation.mutateAsync({
          pageId,
          updates,
        });
        return result.success
          ? { success: true }
          : { success: false, error: "Failed to update page" };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to update page",
        };
      }
    },
    [updatePageMutation]
  );

  const deletePage = useCallback(
    async (pageId: string) => {
      try {
        const result = await deletePageMutation.mutateAsync(pageId);
        return result.success
          ? { success: true }
          : { success: false, error: "Failed to delete page" };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to delete page",
        };
      }
    },
    [deletePageMutation]
  );

  const toggleFavorite = useCallback(
    async (pageId: string) => {
      try {
        const result = await toggleFavoriteMutation.mutateAsync(pageId);
        return result.success
          ? { success: true }
          : { success: false, error: "Failed to toggle favorite" };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to toggle favorite",
        };
      }
    },
    [toggleFavoriteMutation]
  );

  const archivePage = useCallback(
    async (pageId: string) => {
      try {
        const result = await archivePageMutation.mutateAsync(pageId);
        return result.success
          ? { success: true }
          : { success: false, error: "Failed to archive page" };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to archive page",
        };
      }
    },
    [archivePageMutation]
  );

  const restorePage = useCallback(
    async (pageId: string) => {
      try {
        const result = await restorePageMutation.mutateAsync(pageId);
        return result.success
          ? { success: true }
          : { success: false, error: "Failed to restore page" };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to restore page",
        };
      }
    },
    [restorePageMutation]
  );

  const duplicatePage = useCallback(async (pageId: string) => {
    // TODO: Implement duplication in backend
    console.log("Duplicating page:", { pageId });
    return {
      success: false,
      error: "Duplicate functionality not yet implemented",
    };
  }, []);

  const copyPageLink = useCallback(async (pageId: string) => {
    try {
      const pageUrl = `${window.location.origin}/page/${pageId}`;
      await navigator.clipboard.writeText(pageUrl);
      console.log("Copied page link:", { pageId, url: pageUrl });
      return { success: true };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to copy link";
      console.error("Copy page link error:", errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const refreshPages = useCallback(async () => {
    await refetchPages();
  }, [refetchPages]);

  const clearError = useCallback(() => {
    queryClient.resetQueries({ queryKey: ["pages"] });
  }, [queryClient]);

  const value: PageContextValue = {
    pages: pagesData?.pages || [],
    favorites: pagesData?.favorites || [],
    recent: pagesData?.recent || [],
    isLoading: authLoading || workspaceLoading || pagesLoading,
    error: null,
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
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
}
