import {
  PageTreeItem,
  type Page,
} from "@/components/Sidebar/PageTree/PageTreeItem";
import { Icon, Plus } from "lucide-react";
import { SidebarItem } from "@/components/Sidebar/SidebarItem";
import { IconWrapper } from "@/index";
import { Flex } from "@radix-ui/themes";

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
      <Flex
        align="center"
        justify="between"
        className="px-2 mb-2 hover:bg-[var(--sidebar-item-bg-hover)] rounded-[var(--sidebar-item-radius)] py-1"
      >
        <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {title}
        </span>

        <IconWrapper
          icon={Plus}
          onClick={() => onPageCreate?.()}
          variant="button"
        />
      </Flex>

      {/* Page tree */}
      <div className="flex-1 overflow-y-auto mt-0.5">
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
