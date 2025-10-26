import { IconWrapper } from "@/components/IconWrapper";
import { Flex, Text } from "@radix-ui/themes";
import { ChevronDown, ChevronsLeft, SquarePen } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface SidebarHeaderProps {
  /** Icon or emoji for workspace */
  icon?: React.ReactNode;
  /** Workspace or section name */
  label: string;
  /** Callback for toggling sidebar collapse */
  onToggleSidebar?: () => void;
  /** Callback for creating new page */
  onCreateNewPage?: () => void;
  /** Callback when clicking workspace name (e.g., open workspace switcher) */
  onLabelClick?: () => void;
  /** Whether workspace switcher is open */
  isOpen?: boolean;
  /** Custom className */
  className?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  icon,
  label,
  onToggleSidebar,
  onCreateNewPage,
  onLabelClick,
  isOpen = false,
  className,
}) => {
  return (
    <div className={cn("mb-3", className)}>
      {/* Header Container */}
      <Flex
        align="center"
        justify="between"
        className={cn(
          "group/header mb-1 w-full px-2 py-2",
          "rounded-[var(--sidebar-item-radius)]",
          "bg-[var(--sidebar-header-bg)]",
          "hover:bg-[var(--sidebar-header-hover-bg)]",
          "transition-colors duration-150"
        )}
      >
        {/* Left: Icon + Label with dropdown */}
        <Flex
          align="center"
          gap="2"
          className={cn(
            "min-w-0 flex-1 cursor-pointer",
            onLabelClick && "select-none"
          )}
          onClick={onLabelClick}
        >
          {/* Workspace Icon */}
          {icon && (
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
              {icon}
            </div>
          )}

          {/* Workspace Name */}
          <Text
            size="2"
            weight="medium"
            className="truncate text-[var(--sidebar-header-text)]"
          >
            {label}
          </Text>

          {/* Dropdown Chevron (shown on hover) */}
          {onLabelClick && (
            <IconWrapper
              icon={ChevronDown}
              className={cn(
                "h-3 w-3 flex-shrink-0 transition-all duration-200",
                "text-[var(--sidebar-header-icon)]",
                "opacity-0 group-hover/header:opacity-100",
                isOpen && "rotate-180 opacity-100"
              )}
            />
          )}
        </Flex>

        {/* Right: Action Buttons */}
        <Flex gap="1" className="flex-shrink-0">
          {onCreateNewPage && (
            <IconWrapper
              icon={SquarePen}
              onClick={(e) => {
                e.stopPropagation();
                onCreateNewPage();
              }}
              className={cn(
                "h-4 w-4 rounded-sm p-0.5",
                "text-[var(--sidebar-header-icon)]",
                "hover:text-[var(--sidebar-header-icon-hover)]",
                "hover:bg-[var(--sidebar-action-bg-hover)]",
                "cursor-pointer transition-colors"
              )}
            />
          )}
          {onToggleSidebar && (
            <IconWrapper
              icon={ChevronsLeft}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSidebar();
              }}
              className={cn(
                "h-4 w-4 rounded-sm p-0.5",
                "text-[var(--sidebar-header-icon)]",
                "hover:text-[var(--sidebar-header-icon-hover)]",
                "hover:bg-[var(--sidebar-action-bg-hover)]",
                "cursor-pointer transition-colors"
              )}
            />
          )}
        </Flex>
      </Flex>
    </div>
  );
};
