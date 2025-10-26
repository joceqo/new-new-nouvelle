import { IconWrapper } from "@/components/IconWrapper";
import { Flex, Text } from "@radix-ui/themes";
import {
  ChevronRight,
  type LucideIcon,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface SidebarItemProps {
  /** Icon to display */
  icon: LucideIcon;
  /** Item label/text */
  label: string;
  /** Whether this item is currently active/selected */
  isActive?: boolean;
  /** Whether this item is expandable (has children) */
  isExpandable?: boolean;
  /** Whether the item is expanded (only relevant if isExpandable is true) */
  isExpanded?: boolean;
  /** Callback when expand toggle is clicked */
  onToggleExpand?: () => void;
  /** Show action buttons on hover (ellipsis, plus) */
  showActions?: boolean;
  /** Callback for add action */
  onAdd?: (e: React.MouseEvent) => void;
  /** Callback for more action */
  onMore?: (e: React.MouseEvent) => void;
  /** Badge text (e.g., "New", "11") */
  badge?: string;
  /** Badge variant */
  badgeVariant?: "default" | "accent";
  /** Nesting level for indentation (0 = root) */
  level?: number;
  /** Link href (if item is a link) */
  href?: string;
  /** Custom className for icon */
  iconClassName?: string;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
}

export const SidebarItem = React.forwardRef<HTMLDivElement, SidebarItemProps>(
  (
    {
      icon: Icon,
      label,
      isActive = false,
      isExpandable = false,
      isExpanded = false,
      onToggleExpand,
      showActions = false,
      onAdd,
      onMore,
      badge,
      badgeVariant = "default",
      level = 0,
      href,
      iconClassName,
      className,
      onClick,
    },
    ref
  ) => {
    const Tag = href ? "a" : "div";
    const paddingLeft = `${0.5 + level * 1}rem`;

    return (
      <Tag
        ref={ref as any}
        href={href}
        role={isExpandable ? "treeitem" : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group/item flex min-h-[27px] w-full items-center gap-2 px-2 py-1.5",
          "rounded-[var(--sidebar-item-radius)]",
          "bg-[var(--sidebar-item-bg)]",
          "hover:bg-[var(--sidebar-item-bg-hover)]",
          "cursor-pointer transition-all duration-150 select-none",
          "text-[var(--sidebar-item-text)]",
          "whitespace-nowrap",
          isActive && "bg-[var(--sidebar-item-bg-active)]",
          href && "no-underline",
          className
        )}
        style={{ paddingLeft }}
        onClick={onClick}
      >
        {/* Icon / Toggle Area */}
        <Flex
          align="center"
          justify="center"
          className="relative shrink-0"
          style={{ fontSize: "18px" }}
        >
          {isExpandable ? (
            <IconWrapper
              icon={ChevronRight}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className={cn(
                "transition-transform duration-200",
                "text-[var(--sidebar-icon-color)]",
                "hover:text-[var(--sidebar-icon-hover)]",
                isExpanded && "rotate-90"
              )}
              style={{ fontSize: "14px" }}
            />
          ) : (
            <IconWrapper
              icon={Icon}
              className={cn(
                "text-[var(--sidebar-icon-color)]",
                iconClassName
              )}
            />
          )}
        </Flex>

        {/* Title text */}
        <Flex className="min-w-0 flex-1">
          <Text
            size="2"
            weight={isActive ? "medium" : "regular"}
            className="truncate"
          >
            {label}
          </Text>
        </Flex>

        {/* Badge (if present) */}
        {badge && (
          <Text
            size="1"
            className={cn(
              "shrink-0 rounded-[var(--sidebar-item-radius)] px-2 py-0.5 font-medium whitespace-nowrap",
              badgeVariant === "accent"
                ? "bg-[var(--color-accent-blue-text)] text-[var(--color-text-inverse)]"
                : "bg-[var(--sidebar-item-bg-active)] text-[var(--sidebar-item-text-muted)]"
            )}
          >
            {badge}
          </Text>
        )}

        {/* Action buttons (shown on hover) */}
        {showActions && (onAdd || onMore) && (
          <Flex
            align="center"
            gap="1"
            className="shrink-0 opacity-0 transition-opacity duration-150 group-hover/item:opacity-100"
            style={{ fontSize: "16px" }}
          >
            {onMore && (
              <IconWrapper
                icon={MoreHorizontal}
                onClick={(e) => {
                  e.stopPropagation();
                  onMore(e);
                }}
                className={cn(
                  "rounded-sm p-0.5",
                  "text-[var(--sidebar-action-color)]",
                  "hover:text-[var(--sidebar-action-hover-color)]",
                  "hover:bg-[var(--sidebar-action-bg-hover)]",
                  "transition-colors cursor-pointer"
                )}
              />
            )}
            {onAdd && (
              <IconWrapper
                icon={Plus}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(e);
                }}
                className={cn(
                  "rounded-sm p-0.5",
                  "text-[var(--sidebar-action-color)]",
                  "hover:text-[var(--sidebar-action-hover-color)]",
                  "hover:bg-[var(--sidebar-action-bg-hover)]",
                  "transition-colors cursor-pointer"
                )}
              />
            )}
          </Flex>
        )}
      </Tag>
    );
  }
);

SidebarItem.displayName = "SidebarItem";

export default SidebarItem;
