import * as React from 'react';
import { ChevronDown, ChevronsLeft, ChevronsRight, SquarePen } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { Check, Settings, Users, Plus } from 'lucide-react';

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  plan?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  memberCount?: number;
}

export interface WorkspaceHeaderProps {
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
  isSidebarCollapsed?: boolean;
  className?: string;
}

export const WorkspaceHeader = React.forwardRef<HTMLDivElement, WorkspaceHeaderProps>(
  (
    {
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
      isSidebarCollapsed = false,
      className,
    },
    ref
  ) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const getPlanDisplay = (workspace: Workspace) => {
      const plan = workspace.plan || 'free';
      const memberCount = workspace.memberCount || 1;
      return `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan • ${memberCount} member${memberCount > 1 ? 's' : ''}`;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "group flex items-center gap-1 px-3 py-2 rounded-md transition-colors duration-200",
          "hover:bg-sidebar-accent/30",
          className
        )}
      >
        {/* Workspace Switcher Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex flex-1 min-w-0 items-center gap-2 rounded-md px-1.5 py-1 text-sm",
                "hover:bg-sidebar-accent/80 transition-colors duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              )}
            >
              <Avatar
                src={activeWorkspace?.icon}
                fallback={activeWorkspace?.name || 'W'}
                size="sm"
                className="shrink-0"
              />
              <span className="flex-1 truncate text-left font-normal text-sidebar-foreground/90">
                {activeWorkspace?.name || 'Select workspace'}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="bottom" sideOffset={8} className="w-80">
              {/* Workspace Header */}
              {activeWorkspace && (
                <div className="p-4 border-b">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={activeWorkspace.icon}
                      fallback={activeWorkspace.name}
                      size="default"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {activeWorkspace.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getPlanDisplay(activeWorkspace)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {onWorkspaceSettings && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onWorkspaceSettings(activeWorkspace.id);
                          setDropdownOpen(false);
                        }}
                        className="flex-1"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                    )}
                    {onInviteMembers && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInviteMembers(activeWorkspace.id);
                          setDropdownOpen(false);
                        }}
                        className="flex-1"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Invite
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* User Email */}
              {userEmail && (
                <div className="px-4 py-3 border-b">
                  <p className="text-xs text-gray-500 mb-2">{userEmail}</p>
                </div>
              )}

              {/* Workspace List */}
              {workspaces.length > 0 && (
                <div className="py-2">
                  <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onSelect={() => {
                        onWorkspaceChange(workspace.id);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Avatar
                        src={workspace.icon}
                        fallback={workspace.name}
                        size="sm"
                      />
                      <span className="flex-1 truncate">{workspace.name}</span>
                      {activeWorkspace?.id === workspace.id && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              )}

              {/* Create New Workspace */}
              {onCreateWorkspace && (
                <>
                  <DropdownMenuSeparator />
                  <div className="py-2">
                    <DropdownMenuItem
                      onSelect={onCreateWorkspace}
                      className="flex items-center gap-2 text-blue-600"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New workspace</span>
                    </DropdownMenuItem>
                  </div>
                </>
              )}

              {/* Logout */}
              {onLogout && (
                <>
                  <DropdownMenuSeparator />
                  <div className="py-2">
                    <DropdownMenuItem onSelect={onLogout} className="text-red-600">
                      Log out
                    </DropdownMenuItem>
                  </div>
                </>
              )}
            </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse Sidebar Toggle */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={cn(
              "rounded-md hover:bg-sidebar-accent/80 transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              "opacity-60 hover:opacity-100"
            )}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconWrapper
              icon={isSidebarCollapsed ? ChevronsRight : ChevronsLeft}
              size="sm"
              interactive
              className="text-sidebar-foreground"
            />
          </button>
        )}

        {/* New Page Button */}
        {onNewPage && (
          <button
            onClick={onNewPage}
            className={cn(
              "rounded-md hover:bg-sidebar-accent/80 transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              "opacity-60 hover:opacity-100"
            )}
            title="New page"
          >
            <IconWrapper
              icon={SquarePen}
              size="sm"
              interactive
              className="text-sidebar-foreground"
            />
          </button>
        )}

        {/* Dropdown Indicator */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={cn(
            "rounded-md hover:bg-sidebar-accent/80 transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            "opacity-60 hover:opacity-100"
          )}
          title="Workspace options"
        >
          <IconWrapper
            icon={ChevronDown}
            size="xs"
            interactive
            className={cn(
              "text-sidebar-foreground transition-transform",
              dropdownOpen && "rotate-180"
            )}
          />
        </button>
      </div>
    );
  }
);

WorkspaceHeader.displayName = 'WorkspaceHeader';
