import { useParams } from "@tanstack/react-router";
import { Star, MoreHorizontal, Share2, Clock, User } from "lucide-react";
import { Button } from "@nouvelle/ui";
import { useEffect } from "react";
import { usePage } from "../../lib/page-context";
import { extractPageId } from "../../lib/notion-url";

export function PageView() {
  const params = useParams({ strict: false });
  // Support both pageId and pageSlug params (Notion-style routing)
  const rawPageId = (params.pageId || params.pageSlug) as string;
  // Extract the actual ID from the slug (handles both "id" and "Title-id" formats)
  const pageId = extractPageId(rawPageId);
  const { pages, toggleFavorite } = usePage();

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

  // Mark page as opened when viewed
  useEffect(() => {
    // TODO: Call markAsOpened mutation when API is ready
    console.log("Page opened:", pageId);
  }, [pageId]);

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

  const handleToggleFavorite = () => {
    toggleFavorite(pageId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex-shrink-0 border-b">
        <div className="max-w-4xl mx-auto px-8 py-4">
          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={handleToggleFavorite}>
              <Star
                className={`w-4 h-4 mr-1 ${page.isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`}
              />
              {page.isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
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

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Created by you</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Last edited recently</span>
                </div>
              </div>
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
