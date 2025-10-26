import { IconWrapper } from "@/components/IconWrapper";
import { Flex, Text } from "@radix-ui/themes";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface SidebarSectionProps {
  /** Section title */
  title: string;
  /** Section content */
  children: React.ReactNode;
  /** Whether the section is initially collapsed */
  defaultCollapsed?: boolean;
  /** Whether the section is currently collapsed (controlled) */
  isCollapsed?: boolean;
  /** Callback when collapse state changes */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Custom className */
  className?: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  defaultCollapsed = false,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  className,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onToggleCollapse?.(newCollapsed);
  };

  return (
    <Flex direction="column" gap="1" className={className}>
      {/* Section Header */}
      <Flex
        align="center"
        gap="1"
        className={cn(
          "cursor-pointer px-2 py-1 select-none",
          "rounded-[var(--sidebar-item-radius)] hover:bg-[var(--sidebar-item-bg-hover)]",
          "transition-colors duration-150"
        )}
        onClick={handleToggle}
      >
        <IconWrapper
          icon={ChevronDown}
          className={cn(
            "h-3 w-3 text-[var(--sidebar-icon-color)] transition-transform duration-200",
            isCollapsed && "-rotate-90"
          )}
        />
        <Text
          size="1"
          weight="bold"
          className="tracking-wider text-[var(--sidebar-item-text-muted)] uppercase"
        >
          {title}
        </Text>
      </Flex>

      {/* Section Content */}
      {!isCollapsed && (
        <Flex direction="column" gap="1" className="pl-1">
          {children}
        </Flex>
      )}
    </Flex>
  );
};

SidebarSection.displayName = "SidebarSection";

export default SidebarSection;
