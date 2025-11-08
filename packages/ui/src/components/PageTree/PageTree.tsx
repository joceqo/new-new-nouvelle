import { PageTreeItem, type Page } from "./PageTreeItem";
import { Plus } from "lucide-react";

interface PageTreeProps {
  pages: Page[];
  activePageId?: string;
  onPageSelect?: (pageId: string) => void;
  onPageCreate?: (parentId?: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  onPageDelete?: (pageId: string) => void;
  onPageRename?: (pageId: string) => void;
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
  title = "Pages",
}: PageTreeProps) {

  return (
    <div className="flex flex-col h-full" data-testid="page-tree">
      {/* Header */}
      <div className="px-2 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {title}
        </span>
        <button
          onClick={() => onPageCreate?.()}
          className="
            h-6 w-6 p-0
            inline-flex items-center justify-center
            text-[var(--sidebar-action-color)]
            hover:text-[var(--sidebar-action-hover-color)]
            hover:bg-[var(--sidebar-action-bg-hover)]
            rounded
            transition-all duration-150
          "
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Page tree */}
      <div className="flex-1 overflow-y-auto">
        {pages.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--color-text-emphasis-low)]">
            No pages yet
          </div>
        ) : (
          <div className="space-y-0.5">
            {pages.map((page) => (
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
