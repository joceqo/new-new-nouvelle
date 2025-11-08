import { useParams, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../lib/auth-context";
import { useWorkspace } from "../../lib/workspace-context";
import { usePage } from "../../lib/page-context";
import { usePageTitle } from "../../lib/use-page-title";
import { useEffect } from "react";
import { extractPageId } from "../../lib/notion-url";

export function GettingStartedPage() {
  const { pageId: rawPageId } = useParams({ strict: false });
  const { user, isAuthenticated, isLoading } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { pages } = usePage();
  const navigate = useNavigate();

  // Extract the actual ID from the slug (handles both "id" and "Title-id" formats)
  const pageId = rawPageId ? extractPageId(rawPageId) : null;

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

  const page = pageId ? findPageById(pages, pageId) : null;

  // Update browser/window title - use page data if available, otherwise fallback
  usePageTitle({
    title: page?.title || "Getting Started",
    icon: page?.icon,
    suffix: activeWorkspace?.name,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-16 py-12">
          {/* Page Header */}
          <div className="mb-8">
            {page?.icon && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-5xl">{page.icon}</span>
              </div>
            )}
            <h1 className="text-4xl font-semibold text-foreground mb-4">
              {page?.title || "Getting Started"}
            </h1>
          </div>

          {/* User & Workspace Information */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Workspace Information
            </h2>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium w-32">Workspace:</span>
                <span className="text-foreground">My Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium w-32">User Email:</span>
                <span className="text-foreground">{user?.email || 'Not available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium w-32">User ID:</span>
                <span className="text-foreground font-mono text-xs">{user?.id || 'Not available'}</span>
              </div>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg">
              Welcome to Nouvelle! This is your Getting Started page.
            </p>
            <p className="text-muted-foreground">
              The editor is coming soon. For now, you can use the sidebar to navigate through your workspace.
            </p>

            {/* Debug info (can be removed later) */}
            <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground">
                <strong>Page ID:</strong> {pageId}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
