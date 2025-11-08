import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Star,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface Page {
  id: string;
  title: string;
  icon?: string;
  isFavorite?: boolean;
  hasChildren?: boolean;
  children?: Page[];
}

interface PageTreeItemProps {
  page: Page;
  level?: number;
  isActive?: boolean;
  onSelect?: (pageId: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  onCreateChild?: (parentId: string) => void;
  onDelete?: (pageId: string) => void;
  onRename?: (pageId: string) => void;
}

export function PageTreeItem({
  page,
  level = 0,
  isActive = false,
  onSelect,
  onToggleFavorite,
  onCreateChild,
  onDelete,
  onRename,
}: PageTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasChildren = page.children && page.children.length > 0;

  const handleClick = () => {
    if (onSelect) {
      onSelect(page.id);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    switch (action) {
      case "favorite":
        onToggleFavorite?.(page.id);
        break;
      case "new-child":
        onCreateChild?.(page.id);
        break;
      case "rename":
        onRename?.(page.id);
        break;
      case "delete":
        onDelete?.(page.id);
        break;
    }
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors",
          "hover:bg-accent",
          isActive && "bg-accent",
          "text-sm"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/Collapse chevron */}
        <button
          className={cn(
            "w-4 h-4 flex items-center justify-center rounded hover:bg-accent-foreground/10 transition-colors",
            !hasChildren && "opacity-0 pointer-events-none"
          )}
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>

        {/* Page icon */}
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {page.icon ? (
            <span className="text-base leading-none">{page.icon}</span>
          ) : (
            <FileText className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Page title */}
        <span className="flex-1 truncate text-foreground">{page.title}</span>

        {/* Favorite star */}
        {page.isFavorite && (
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
        )}

        {/* Action buttons (visible on hover) */}
        {isHovered && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent-foreground/10 transition-colors opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onCreateChild?.(page.id);
              }}
            >
              <Plus className="w-3 h-3" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent-foreground/10 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => handleMenuAction("favorite", e as any)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {page.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleMenuAction("new-child", e as any)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New page inside
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => handleMenuAction("rename", e as any)}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleMenuAction("delete", e as any)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Child pages */}
      {isExpanded && hasChildren && (
        <div>
          {page.children?.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child}
              level={level + 1}
              isActive={isActive}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
}
