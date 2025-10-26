import { SidebarHeader } from "../SidebarHeader/SidebarHeader";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { Flex, ScrollArea, Separator } from "@radix-ui/themes";
import { Search, Home, Sparkles, Inbox, User, Trash2 } from "lucide-react";
import React from "react";

export interface SidebarProps {
  icon?: React.ReactNode;
  workspaceName?: string;
  onToggleSidebar?: () => void;
  onCreateNewPage?: () => void;
  onWorkspaceClick?: () => void;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  icon,
  workspaceName = "My Workspace",
  onToggleSidebar = () => {},
  onCreateNewPage = () => {},
  onWorkspaceClick = () => {},
  children,
}) => {
  return (
    <Flex
      direction="column"
      className="h-screen w-64 bg-(--sidebar-bg) text-(--sidebar-item-text)"
      p="3"
    >
      {/* Header */}
      <SidebarHeader
        icon={icon}
        label={workspaceName}
        onToggleSidebar={onToggleSidebar}
        onCreateNewPage={onCreateNewPage}
        onLabelClick={onWorkspaceClick}
      />

      {/* Navigation Links */}
      <Flex direction="column" gap="0.5" mb="3">
        <SidebarItem icon={Search} label="Search" />
        <SidebarItem icon={Home} label="Home" isActive />
        <SidebarItem
          icon={Sparkles}
          label="Notion AI"
          badge="New"
          badgeVariant="accent"
        />
        <SidebarItem icon={Inbox} label="Inbox" />
      </Flex>

      <Separator size="4" mb="3" />

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1">
        <Flex direction="column" gap="2">
          {children}
        </Flex>
      </ScrollArea>

      {/* Footer */}
      <Flex direction="column" gap="0.5" mt="3" pt="3">
        <Separator size="4" mb="2" />
        <SidebarItem icon={User} label="Profile" />
        <SidebarItem icon={Trash2} label="Trash" badge="11" />
      </Flex>
    </Flex>
  );
};
