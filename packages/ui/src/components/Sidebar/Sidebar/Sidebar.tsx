import { SidebarItem } from "@/components/Sidebar/SidebarItem/SidebarItem";
import {
  WorkspaceHeader,
  Workspace,
} from "@/components/Sidebar/WorkspaceSwitcher/WorkspaceHeader";
import { InlineInbox } from "@/components/Sidebar/Inbox/InlineInbox";
import { Flex, ScrollArea, Separator } from "@radix-ui/themes";
import {
  Search,
  Home,
  Sparkles,
  Inbox,
  User,
  Trash2,
  Menu,
  ChevronsRight,
} from "lucide-react";
import React from "react";
import { IconWrapper } from "@/components/IconWrapper";

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

  // Inline inbox props
  showInbox?: boolean;
  onInboxClose?: () => void;

  // Scroll area styling
  scrollAreaClassName?: string;
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
  showInbox = false,
  onInboxClose,
  scrollAreaClassName = "sidebar-scroll-area",
}) => {
  const [isHamburgerShown, setIsHamburgerShown] = React.useState(false);
  const [isHamburgerHovered, setIsHamburgerHovered] = React.useState(false);
  return (
    <div className="p-0.5">
      {isHamburgerShown && (
        <div>
          <IconWrapper
            icon={isHamburgerHovered ? ChevronsRight : Menu}
            onMouseEnter={() => setIsHamburgerHovered(true)}
            onMouseLeave={() => setIsHamburgerHovered(false)}
            onClick={() => {
              onToggleSidebar?.();
              setIsHamburgerShown(false);
            }}
            variant="button"
          />
        </div>
      )}
      {!isHamburgerShown && (
        <Flex
          asChild
          direction="column"
          className="h-screen w-full bg-[var(--sidebar-bg)] px-2 py-5 text-[var(--sidebar-item-text)]"
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
              onToggleSidebar={() => {
                onToggleSidebar?.();
                setIsHamburgerShown((prev) => !prev);
              }}
              isSidebarCollapsed={isSidebarCollapsed}
              className="mb-3"
            />

            {/* Navigation Links */}
            <Flex direction="column" gap="1" mb="3">
              <SidebarItem
                icon={Search}
                label="Search"
                onClick={onSearchClick}
              />
              <SidebarItem icon={Home} label="Home" onClick={onHomeClick} />

              <SidebarItem icon={Inbox} label="Inbox" onClick={onInboxClick} />
            </Flex>

            {/* Inline Inbox */}
            <InlineInbox
              open={showInbox}
              onClose={onInboxClose || (() => {})}
            />

            {/* Scrollable Content Area */}
            <ScrollArea className="flex-1 [&_[data-radix-scroll-area-viewport]>div]:!w-full">
              <Flex direction="column" gap="2" className="w-full">
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
      )}
    </div>
  );
};
