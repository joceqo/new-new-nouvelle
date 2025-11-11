import {
  PageTreeItem,
  type Page,
} from "@/components/Sidebar/PageTree/PageTreeItem";
import { Plus, MoreHorizontal } from "lucide-react";
import { IconWrapper } from "@/index";
import { Flex } from "@radix-ui/themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface PageTreeProps {
  pages: Page[];
  activePageId?: string;
  onPageSelect?: (pageId: string) => void;
  onPageCreate?: (parentId?: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  onPageDelete?: (pageId: string) => void;
  onPageRename?: (pageId: string) => void;
  onDuplicate?: (pageId: string) => void;
  onCopyLink?: (pageId: string) => void;
  title?: string;
  maxItems?: number;
  showCreateButton?: boolean;
}

export function PageTree({
  pages,
  activePageId,
  onPageSelect,
  onPageCreate,
  onToggleFavorite,
  onPageDelete,
  onPageRename,
  onDuplicate,
  onCopyLink,
  title = "Pages",
  maxItems,
  showCreateButton = true,
}: PageTreeProps) {
  // Determine visible pages and overflow
  const hasOverflow = maxItems && pages.length > maxItems;
  const visiblePages = hasOverflow ? pages.slice(0, maxItems - 1) : pages;
  const overflowPages = hasOverflow ? pages.slice(maxItems - 1) : [];

  return (
    <div className="flex flex-col h-full" data-testid="page-tree">
      {/* Header */}
      <Flex
        align="center"
        justify="between"
        className="px-2 mb-2 hover:bg-[var(--sidebar-item-bg-hover)] rounded-[var(--sidebar-item-radius)] py-1"
      >
        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {title}
        </span>

        <div className={cn(!showCreateButton && "invisible")}>
          <IconWrapper
            icon={Plus}
            onClick={() => onPageCreate?.()}
            variant="button"
          />
        </div>
      </Flex>

      {/* Page tree */}
      <div className="flex-1 overflow-y-auto mt-0.5">
        {pages.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--color-text-emphasis-low)]">
            No pages yet
          </div>
        ) : (
          <div className="space-y-0.5 w-full">
            {visiblePages.map((page) => {
              const isActive = page.id === activePageId;
              return (
                <PageTreeItem
                  key={page.id}
                  page={page}
                  isActive={isActive}
                  activePageId={activePageId}
                  onSelect={onPageSelect}
                  onToggleFavorite={onToggleFavorite}
                  onCreateChild={onPageCreate}
                  onDelete={onPageDelete}
                  onRename={onPageRename}
                  onDuplicate={onDuplicate}
                  onCopyLink={onCopyLink}
                />
              );
            })}

            {/* Overflow menu item */}
            {hasOverflow && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Flex
                    align="center"
                    className={cn(
                      "group gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors",
                      "hover:bg-[var(--sidebar-item-bg-hover)]",
                      "text-sm"
                    )}
                    style={{ paddingLeft: "8px" }}
                  >
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="flex-1 truncate text-muted-foreground">
                      {overflowPages.length} more pages...
                    </span>
                  </Flex>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 max-h-96 overflow-y-auto"
                >
                  {overflowPages.map((page) => (
                    <DropdownMenuItem
                      key={page.id}
                      onClick={() => onPageSelect?.(page.id)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">{page.icon || "📄"}</span>
                      <span className="truncate">{page.title}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
