import { useParams, useNavigate } from "@tanstack/react-router";
import { Star, MoreHorizontal, Copy, Trash2, Link, FileText } from "lucide-react";
import { IconWrapper } from "@nouvelle/ui";
import { useEffect, useState } from "react";
import { usePage } from "../../lib/page-context";
import { useWorkspace } from "../../lib/workspace-context";
import { usePageTitle } from "../../lib/use-page-title";
import { extractPageId, createPageSlug } from "../../lib/notion-url";
import { formatRelativeTime } from "../../lib/time-format";
import { trackPageVisit } from "../../lib/recent-pages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nouvelle/ui";

// Slash separator SVG component (Notion-style)
const SlashSeparator = () => (
  <span style={{ width: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: 0 }}>
    <svg
      aria-hidden="true"
      role="graphics-symbol"
      viewBox="0 0 20 20"
      style={{ width: "20px", height: "20px", display: "block", fill: "var(--color-text-muted)", flexShrink: 0 }}
    >
      <path d="M11.762 2.891a.625.625 0 0 1 .475.632l-.018.125-3.224 13.005a.625.625 0 1 1-1.213-.301l3.224-13.005.042-.119a.625.625 0 0 1 .714-.337" />
    </svg>
  </span>
);

export function PageView() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  // Support both pageId and pageSlug params (Notion-style routing)
  const rawPageId = (params.pageId || params.pageSlug) as string;
  // Extract the actual ID from the slug (handles both "id" and "Title-id" formats)
  const pageId = extractPageId(rawPageId);
  const { pages, toggleFavorite, copyPageLink, duplicatePage, deletePage } = usePage();
  const { activeWorkspace } = useWorkspace();

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

  // Get parent chain for breadcrumbs
  const getParentChain = (pages: any[], targetId: string, chain: any[] = []): any[] | null => {
    for (const page of pages) {
      if (page.id === targetId) {
        return [...chain, page];
      }
      if (page.children) {
        const found = getParentChain(page.children, targetId, [...chain, page]);
        if (found) return found;
      }
    }
    return null;
  };

  const page = findPageById(pages, pageId);
  const breadcrumbs = page ? getParentChain(pages, pageId) || [page] : [];

  // State to trigger re-render for relative time updates
  const [, setCurrentTime] = useState(Date.now());

  // Update browser tab title with emoji and page title
  usePageTitle({
    title: page?.title,
    icon: page?.icon,
    suffix: activeWorkspace?.name,
  });

  // Mark page as opened when viewed
  useEffect(() => {
    if (page) {
      // Track visit in localStorage
      trackPageVisit(page.id, page.title, page.icon);

      // TODO: Call markAsOpened mutation when API is ready
      console.log("Page opened:", pageId);
    }
  }, [pageId, page]);

  // Update relative time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page not found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or you don't have access
            to it.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    await toggleFavorite(pageId);
  };

  const handleCopyLink = async () => {
    await copyPageLink(pageId);
  };

  const handleDuplicate = async () => {
    await duplicatePage(pageId);
  };

  const handleDelete = async () => {
    const result = await deletePage(pageId);
    if (result.success) {
      navigate({ to: "/home" });
    }
  };

  const navigateToPage = (pageId: string, pageTitle: string) => {
    const slug = createPageSlug(pageTitle, pageId);
    navigate({ to: "/$pageSlug", params: { pageSlug: slug } });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex-shrink-0 border-b">
        <div className="max-w-4xl mx-auto px-8 py-4">
          {/* Top bar with breadcrumbs and actions */}
          <div className="flex items-center justify-between mb-4">
            {/* Breadcrumbs */}
            <div className="flex items-center" style={{ lineHeight: 1.2, fontSize: "14px", flexGrow: 0, minWidth: 0 }}>
              {breadcrumbs.length === 1 ? (
                // No parent - show as single button with icon
                <button
                  className="inline-flex items-center h-6 px-1.5 rounded-md whitespace-nowrap transition-colors hover:bg-accent"
                  style={{ fontSize: "14px", lineHeight: 1.2, minWidth: 0 }}
                >
                  <div className="flex items-center justify-center h-5 w-5 rounded flex-shrink-0 mr-1.5">
                    {page.icon ? (
                      <span className="text-base leading-none">{page.icon}</span>
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className="truncate"
                    style={{ maxWidth: "240px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {page.title}
                  </div>
                </button>
              ) : (
                // Has parents - show chain with slashes
                <div className="flex items-center min-w-0">
                  {(() => {
                    // Collapse logic: if 4+ pages, show First / ... / SecondToLast / Last
                    const shouldCollapse = breadcrumbs.length >= 4;
                    let displayBreadcrumbs = breadcrumbs;
                    let hasEllipsis = false;

                    if (shouldCollapse) {
                      // Show: [0] / ... / [n-2] / [n-1]
                      displayBreadcrumbs = [
                        breadcrumbs[0],
                        breadcrumbs[breadcrumbs.length - 2],
                        breadcrumbs[breadcrumbs.length - 1],
                      ];
                      hasEllipsis = true;
                    }

                    return displayBreadcrumbs.map((crumb, index) => {
                      const isLast = index === displayBreadcrumbs.length - 1;
                      const showIcon = !isLast; // Only parents show icons
                      const maxWidth = isLast ? "240px" : "160px";

                      return (
                        <div key={crumb.id} className="flex items-center min-w-0">
                          {/* Show ellipsis before second-to-last if collapsed */}
                          {hasEllipsis && index === 1 && (
                            <>
                              <SlashSeparator />
                              <span className="px-1.5 text-muted-foreground">...</span>
                              <SlashSeparator />
                            </>
                          )}

                          {/* Breadcrumb item */}
                          {isLast ? (
                            // Current page - not clickable
                            <button
                              className="inline-flex items-center h-6 px-1.5 rounded-md whitespace-nowrap transition-colors"
                              style={{ fontSize: "inherit", lineHeight: 1.2, minWidth: 0 }}
                            >
                              <div
                                className="truncate"
                                style={{ maxWidth, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                              >
                                {crumb.title}
                              </div>
                            </button>
                          ) : (
                            // Parent page - clickable
                            <>
                              <button
                                onClick={() => navigateToPage(crumb.id, crumb.title)}
                                className="inline-flex items-center h-6 px-1.5 rounded-md whitespace-nowrap transition-colors hover:bg-accent"
                                style={{ fontSize: "inherit", lineHeight: 1.2, minWidth: 0 }}
                              >
                                <div className="flex items-center min-w-0">
                                  {showIcon && (
                                    <div className="flex items-center justify-center h-5 w-5 rounded flex-shrink-0 mr-1.5">
                                      {crumb.icon ? (
                                        <span className="text-base leading-none">{crumb.icon}</span>
                                      ) : (
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                      )}
                                    </div>
                                  )}
                                  <div
                                    className="truncate"
                                    style={{ maxWidth, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                  >
                                    {crumb.title}
                                  </div>
                                </div>
                              </button>
                              <SlashSeparator />
                            </>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-2">
                {formatRelativeTime(page.updatedAt)}
              </span>

              <IconWrapper
                icon={Star}
                size="sm"
                variant="button"
                onClick={handleToggleFavorite}
                iconProps={
                  page.isFavorite
                    ? { fill: "rgb(234 179 8)", strokeWidth: 0 }
                    : {}
                }
                className={page.isFavorite ? "text-yellow-600" : ""}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <IconWrapper
                      icon={MoreHorizontal}
                      size="sm"
                      variant="button"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Link className="w-4 h-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Move to trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Cover image (if exists) */}
          {page.coverImage && (
            <div className="w-full h-48 mb-6 rounded-lg overflow-hidden bg-muted">
              <img
                src={page.coverImage}
                alt="Page cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Page icon and title */}
          <div className="flex items-start gap-4">
            {page.icon && (
              <div className="text-6xl leading-none mt-2">{page.icon}</div>
            )}
            <div className="flex-1">
              <h1
                className="text-4xl font-bold mb-2 outline-none"
                contentEditable
              >
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {/* Placeholder content area */}
          <div className="min-h-screen">
            <div className="text-muted-foreground text-sm mb-4">
              Start writing or press{" "}
              <kbd className="px-2 py-1 rounded bg-muted">Space</kbd> for AI,{" "}
              <kbd className="px-2 py-1 rounded bg-muted">/</kbd> for commands
            </div>

            {/* This is where the block editor will go later */}
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground italic">
                Editor placeholder - this is where your block editor will be
                integrated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
