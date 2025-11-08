import { PageTreeItem, type Page } from "./PageTreeItem";
import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface PageTreeProps {
  pages: Page[];
  activePageId?: string;
  onPageSelect?: (pageId: string) => void;
  onPageCreate?: (parentId?: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  onPageDelete?: (pageId: string) => void;
  onPageRename?: (pageId: string) => void;
  showSearch?: boolean;
  title?: string;
}

export function PageTree({
  pages,
  activePageId,
  onPageSelect,
  onPageCreate,
  onToggleFavorite,
  onPageDelete,
  onPageRename,
  showSearch = false,
  title = "Pages",
}: PageTreeProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filterPages = (pages: Page[], query: string): Page[] => {
    if (!query) return pages;

    const filtered: Page[] = [];

    for (const page of pages) {
      const matchesTitle = page.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const filteredChildren = page.children
        ? filterPages(page.children, query)
        : [];

      if (matchesTitle || filteredChildren.length > 0) {
        filtered.push({
          ...page,
          children:
            filteredChildren.length > 0 ? filteredChildren : page.children,
        });
      }
    }

    return filtered;
  };

  const filteredPages = filterPages(pages, searchQuery);

  return (
    <div className="flex flex-col h-full" data-testid="page-tree">
      {/* Header */}
      <div className="px-2 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onPageCreate?.()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>
      )}

      {/* Page tree */}
      <div className="flex-1 overflow-y-auto">
        {filteredPages.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            {searchQuery ? "No pages found" : "No pages yet"}
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredPages.map((page) => (
              <PageTreeItem
                key={page.id}
                page={page}
                isActive={page.id === activePageId}
                onSelect={onPageSelect}
                onToggleFavorite={onToggleFavorite}
                onCreateChild={onPageCreate}
                onDelete={onPageDelete}
                onRename={onPageRename}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
