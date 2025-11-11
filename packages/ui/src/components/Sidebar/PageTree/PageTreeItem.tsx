import { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Star,
  MoreHorizontal,
  Plus,
  Link,
  Copy,
  Trash2,
  StarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IconWrapper } from "@/components/IconWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Page {
  id: string;
  title: string;
  icon?: string;
  isFavorite?: boolean;
  visibility?: "private" | "workspace" | "public";
  hasChildren?: boolean;
  children?: Page[];
}

interface PageTreeItemProps {
  page: Page;
  level?: number;
  isActive?: boolean;
  activePageId?: string;
  onSelect?: (pageId: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  onCreateChild?: (parentId: string) => void;
  onDelete?: (pageId: string) => void;
  onRename?: (pageId: string) => void;
  onDuplicate?: (pageId: string) => void;
  onCopyLink?: (pageId: string) => void;
}

export function PageTreeItem({
  page,
  level = 0,
  isActive = false,
  activePageId,
  onSelect,
  onToggleFavorite,
  onCreateChild,
  onDelete,
  onRename,
  onDuplicate,
  onCopyLink,
}: PageTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);

  // Refs for debugging width constraints
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const hasChildren = page.children && page.children.length > 0;

  // Debug logging for width constraints
  useEffect(() => {
    if (containerRef.current && titleRef.current && iconRef.current && actionsRef.current) {
      const containerStyles = window.getComputedStyle(containerRef.current);
      const titleStyles = window.getComputedStyle(titleRef.current);
      const iconStyles = window.getComputedStyle(iconRef.current);
      const actionsStyles = window.getComputedStyle(actionsRef.current);
      const parentStyles = containerRef.current.parentElement ? window.getComputedStyle(containerRef.current.parentElement) : null;

      const iconWidth = parseFloat(iconStyles.width);
      const titleWidth = parseFloat(titleStyles.width);
      const actionsWidth = parseFloat(actionsStyles.width);
      const totalChildWidth = iconWidth + titleWidth + actionsWidth;
      const containerWidth = parseFloat(containerStyles.width);

      console.log(`[PageTreeItem: ${page.title}] Width Debug:`, {
        parent: parentStyles ? { width: parentStyles.width } : null,
        container: {
          width: containerStyles.width,
          maxWidth: containerStyles.maxWidth,
          overflow: containerStyles.overflow,
        },
        title: {
          width: titleStyles.width,
          flex: titleStyles.flex,
          overflow: titleStyles.overflow,
          textOverflow: titleStyles.textOverflow,
        },
        icon: { width: iconStyles.width },
        actions: { width: actionsStyles.width, flexShrink: actionsStyles.flexShrink },
        calculated: {
          totalChildren: `${totalChildWidth.toFixed(2)}px`,
          containerWidth: `${containerWidth.toFixed(2)}px`,
          overflow: totalChildWidth > containerWidth ? 'YES - OVERFLOWING!' : 'No',
          difference: `${(containerWidth - totalChildWidth).toFixed(2)}px`,
        }
      });
    }
  }, [page.title, isHovered]);

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
      case "copy-link":
        onCopyLink?.(page.id);
        break;
      case "duplicate":
        onDuplicate?.(page.id);
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
    <div className="w-full">
      <div
        ref={containerRef}
        className={cn(
          "group flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors",
          "hover:bg-[var(--sidebar-item-bg-hover)]",
          isActive && "bg-[var(--sidebar-item-bg-active)]",
          "text-sm w-full overflow-hidden"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Interactive icon/chevron */}
        <div
          ref={iconRef}
          className="inline-flex items-center justify-center flex-shrink-0"
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
        >
          {iconHovered ? (
            <IconWrapper
              icon={isExpanded ? ChevronDown : ChevronRight}
              size="sm"
              variant="button"
              onClick={toggleExpand}
            />
          ) : page.icon ? (
            <IconWrapper size="sm" interactive>
              <span className="text-base leading-none">{page.icon}</span>
            </IconWrapper>
          ) : (
            <IconWrapper
              icon={FileText}
              size="sm"
              interactive
              className="text-muted-foreground"
            />
          )}
        </div>

        {/* Page title - with proper truncation */}
        <span ref={titleRef} className="flex-1 truncate text-foreground min-w-0">
          {page.title}
        </span>

        {/* Action buttons (always in flex flow, fade in/out) */}
        <div
          ref={actionsRef}
          className={cn(
            "flex items-center gap-1 flex-shrink-0 transition-opacity duration-150",
            (isHovered || isDropdownOpen) ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent-foreground/10 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("favorite", e as any)}
              >
                {page.isFavorite ? (
                  <>
                    <StarOff className="w-4 h-4 mr-2" />
                    <span>Remove from favorites</span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    <span>Add to favorites</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("new-child", e as any)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New page inside
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("copy-link", e as any)}
              >
                <Link className="w-4 h-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("duplicate", e as any)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("rename", e as any)}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleMenuAction("delete", e as any)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent-foreground/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onCreateChild?.(page.id);
            }}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Child pages or empty state */}
      {isExpanded && (
        <div>
          {hasChildren ? (
            page.children?.map((child) => {
              const isChildActive = activePageId ? child.id === activePageId : false;
              return (
                <PageTreeItem
                  key={child.id}
                  page={child}
                  level={level + 1}
                  isActive={isChildActive}
                  activePageId={activePageId}
                  onSelect={onSelect}
                  onToggleFavorite={onToggleFavorite}
                  onCreateChild={onCreateChild}
                  onDelete={onDelete}
                  onRename={onRename}
                  onDuplicate={onDuplicate}
                  onCopyLink={onCopyLink}
                />
              );
            })
          ) : (
            <div
              className="px-2 py-1 text-xs text-muted-foreground italic"
              style={{ paddingLeft: `${(level + 1) * 12 + 8 + 20}px` }}
            >
              No pages inside
            </div>
          )}
        </div>
      )}
    </div>
  );
}
