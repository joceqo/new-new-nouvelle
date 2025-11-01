import { SidebarHeader } from "../SidebarHeader/SidebarHeader";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { WorkspaceHeader } from "../../WorkspaceSwitcher/WorkspaceHeader";
import { Flex, ScrollArea, Separator } from "@radix-ui/themes";
import { Search, Home, Sparkles, Inbox, User, Trash2 } from "lucide-react";
import React from "react";

interface Workspace {
  id: string;
  name: string;
  icon?: string;
  plan?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  memberCount?: number;
}

export interface SidebarProps {
  icon?: React.ReactNode;
  workspaceName?: string;
  onToggleSidebar?: () => void;
  onCreateNewPage?: () => void;
  onWorkspaceClick?: () => void;
  onLogout?: () => void;
  children?: React.ReactNode;
  isSidebarCollapsed?: boolean;

  // Workspace switcher props (optional)
  workspaces?: Workspace[];
  activeWorkspace?: Workspace | null;
  onWorkspaceChange?: (workspaceId: string) => void;
  onCreateWorkspace?: () => void;
  onWorkspaceSettings?: (workspaceId: string) => void;
  onInviteMembers?: (workspaceId: string) => void;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  icon,
  workspaceName = "My Workspace",
  onToggleSidebar = () => {},
  onCreateNewPage = () => {},
  onWorkspaceClick = () => {},
  onLogout,
  children,
  isSidebarCollapsed = false,
  // Workspace switcher props
  workspaces,
  activeWorkspace,
  onWorkspaceChange,
  onCreateWorkspace,
  onWorkspaceSettings,
  onInviteMembers,
  userEmail,
}) => {
  // Use WorkspaceHeader if workspace data is provided, otherwise use SidebarHeader
  const useWorkspaceHeader = workspaces && workspaces.length > 0;

  return (
    <Flex
      direction="column"
      className="h-screen w-64 px-5 py-5 bg-[var(--sidebar-bg)] text-[var(--sidebar-item-text)]"
    >
      {/* Header with WorkspaceHeader or legacy SidebarHeader */}
      {useWorkspaceHeader ? (
        <WorkspaceHeader
          workspaces={workspaces}
          activeWorkspace={activeWorkspace || null}
          onWorkspaceChange={onWorkspaceChange || (() => {})}
          onCreateWorkspace={onCreateWorkspace}
          onWorkspaceSettings={onWorkspaceSettings}
          onInviteMembers={onInviteMembers}
          onLogout={onLogout}
          userEmail={userEmail}
          onNewPage={onCreateNewPage}
          onToggleSidebar={onToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          className="mb-3 -mx-5 -mt-5"
        />
      ) : (
        <SidebarHeader
          icon={icon}
          label={workspaceName}
          onToggleSidebar={onToggleSidebar}
          onCreateNewPage={onCreateNewPage}
          onLabelClick={onWorkspaceClick}
          onLogout={onLogout}
        />
      )}

      {/* Navigation Links */}
      <Flex direction="column" gap="1" mb="3">
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
