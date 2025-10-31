import { IconWrapper } from "@/components/IconWrapper";
import { Flex, Text } from "@radix-ui/themes";
import { ChevronDown, ChevronsLeft, SquarePen, LogOut } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
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
  /** Callback for logout action */
  onLogout?: () => void;
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
  onLogout,
  isOpen = false,
  className,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
        <div className="relative flex-1" ref={dropdownRef}>
          <Flex
            align="center"
            gap="2"
            className={cn(
              "min-w-0 flex-1 cursor-pointer",
              "select-none"
            )}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Workspace Icon */}
            {icon && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
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
            <IconWrapper
              icon={ChevronDown}
              className={cn(
                "h-3 w-3 shrink-0 transition-all duration-200",
                "text-[var(--sidebar-header-icon)]",
                "opacity-0 group-hover/header:opacity-100",
                isDropdownOpen && "rotate-180 opacity-100"
              )}
            />
          </Flex>

          {/* Dropdown Menu */}
          {isDropdownOpen && onLogout && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-50">
              <button
                onClick={() => {
                  onLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

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
