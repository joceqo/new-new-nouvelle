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
    const Component = href ? "a" : "div";
    const paddingLeft = `${0.5 + level * 1}rem`;

    return (
      <Component
        ref={ref as any}
        href={href}
        role={isExpandable ? "treeitem" : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group/item flex min-h-[27px] w-full items-center px-2 py-1",
          "rounded-(--sidebar-item-radius)",
          "bg-(--sidebar-item-bg)",
          "hover:bg-(--sidebar-item-bg-hover)",
          "cursor-pointer transition-all duration-150 select-none",
          "text-(--sidebar-item-text)",
          isActive && "bg-(--sidebar-item-bg-active)",
          href && "no-underline",
          className
        )}
        style={{ paddingLeft }}
        onClick={onClick}
      >
        {/* Icon / Toggle Area */}
        <Flex align="center" justify="center" className="relative mr-2 h-6 w-6">
          {isExpandable ? (
            <IconWrapper
              icon={ChevronRight}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                "text-(--sidebar-icon-color)",
                "hover:text-(--sidebar-icon-hover)",
                isExpanded && "rotate-90"
              )}
            />
          ) : (
            <IconWrapper
              icon={Icon}
              className={cn(
                "h-[18px] w-[18px] text-(--sidebar-icon-color)",
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
              "ml-2 rounded-(--sidebar-item-radius) px-2 py-0.5 font-medium whitespace-nowrap",
              badgeVariant === "accent"
                ? "bg-(--color-accent-blue-text) text-(--color-text-inverse)"
                : "bg-(--sidebar-item-bg-active) text-(--sidebar-item-text-muted)"
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
            className="ml-2 opacity-0 transition-opacity duration-150 group-hover/item:opacity-100"
          >
            {onMore && (
              <IconWrapper
                icon={MoreHorizontal}
                onClick={(e) => {
                  e.stopPropagation();
                  onMore(e);
                }}
                className={cn(
                  "h-4 w-4 rounded-sm p-0.5",
                  "text-(--sidebar-action-color)",
                  "hover:text-(--sidebar-action-hover-color)",
                  "hover:bg-(--sidebar-action-bg-hover)",
                  "transition-colors"
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
                  "h-4 w-4 rounded-sm p-0.5",
                  "text-[(--sidebar-action-color)]",
                  "hover:text-[(--sidebar-action-hover-color)]",
                  "hover:bg-(--sidebar-action-bg-hover)]",
                  "transition-colors"
                )}
              />
            )}
          </Flex>
        )}
      </Component>
    );
  }
);

SidebarItem.displayName = "SidebarItem";

export default SidebarItem;
