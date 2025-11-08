import { SidebarItem } from "../SidebarItem/SidebarItem";
import {
  WorkspaceHeader,
  Workspace,
} from "../../WorkspaceSwitcher/WorkspaceHeader";
import { Flex, ScrollArea, Separator } from "@radix-ui/themes";
import { Search, Home, Sparkles, Inbox, User, Trash2 } from "lucide-react";
import React from "react";

export interface SidebarProps {
  children?: React.ReactNode;
  isSidebarCollapsed?: boolean;

  // WorkspaceHeader props
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  onWorkspaceChange: (workspaceId: string) => void;
  onCreateWorkspace?: () => void;
  onWorkspaceSettings?: (workspaceId: string) => void;
  onInviteMembers?: (workspaceId: string) => void;
  onLogout?: () => void;
  userEmail?: string;
  onNewPage?: () => void;
  onToggleSidebar?: () => void;

  // Navigation callbacks
  onSearchClick?: () => void;
  onHomeClick?: () => void;
  onInboxClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  isSidebarCollapsed = false,
  workspaces,
  activeWorkspace,
  onWorkspaceChange,
  onCreateWorkspace,
  onWorkspaceSettings,
  onInviteMembers,
  onLogout,
  userEmail,
  onNewPage,
  onToggleSidebar,
  onSearchClick,
  onHomeClick,
  onInboxClick,
}) => {
  return (
    <Flex
      asChild
      direction="column"
      className="h-screen w-64 bg-[var(--sidebar-bg)] px-5 py-5 text-[var(--sidebar-item-text)]"
    >
      <aside data-testid="sidebar">
      {/* WorkspaceHeader */}
      <WorkspaceHeader
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={onWorkspaceChange}
        onCreateWorkspace={onCreateWorkspace}
        onWorkspaceSettings={onWorkspaceSettings}
        onInviteMembers={onInviteMembers}
        onLogout={onLogout}
        userEmail={userEmail}
        onNewPage={onNewPage}
        onToggleSidebar={onToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        className="-mx-5 -mt-5 mb-3"
      />

      {/* Navigation Links */}
      <Flex direction="column" gap="1" mb="3">
        <SidebarItem
          icon={Search}
          label="Search"
          onClick={onSearchClick}
        />
        <SidebarItem
          icon={Home}
          label="Home"
          onClick={onHomeClick}
        />
        <SidebarItem
          icon={Sparkles}
          label="Notion AI"
          badge="New"
          badgeVariant="accent"
        />
        <SidebarItem
          icon={Inbox}
          label="Inbox"
          onClick={onInboxClick}
        />
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
      </aside>
    </Flex>
  );
};
