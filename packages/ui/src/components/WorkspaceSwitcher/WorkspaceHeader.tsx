import * as React from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  SquarePen,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { WorkspaceIcon } from "./WorkspaceIcon";
import { IconWrapper } from "../IconWrapper/IconWrapper";
import { Check, Plus } from "lucide-react";

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  plan?: string;
  role: "owner" | "admin" | "member" | "guest";
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

export const WorkspaceHeader = React.forwardRef<
  HTMLDivElement,
  WorkspaceHeaderProps
>(
  (
    {
      workspaces,
      activeWorkspace,
      onWorkspaceChange,
      onCreateWorkspace,
      onNewPage,
      onToggleSidebar,
      isSidebarCollapsed = false,
      className,
    },
    ref
  ) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 rounded-md px-2 py-1.5",
          "group hover:bg-sidebar-accent",
          className
        )}
      >
        {/* Workspace Switcher Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-0.5 text-sm",
                "focus-visible:ring-sidebar-ring focus:outline-none focus-visible:ring-2"
              )}
            >
              <WorkspaceIcon
                value={activeWorkspace?.icon || activeWorkspace?.name}
                className="shrink-0"
                style={{ fontSize: "16px" }}
              />
              <span className="text-sidebar-foreground flex-1 truncate text-left font-medium">
                {activeWorkspace?.name || "Select workspace"}
              </span>
              <ChevronDown
                className={cn(
                  "text-sidebar-foreground/70 h-4 w-4 shrink-0 transition-transform",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="bottom"
            sideOffset={4}
            className="w-64"
          >
            {/* Workspace List */}
            {workspaces.length > 0 && (
              <div className="py-1">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onSelect={() => {
                      onWorkspaceChange(workspace.id);
                    }}
                    className="flex items-center gap-2.5 px-2 py-1.5"
                  >
                    <WorkspaceIcon
                      value={workspace.icon || workspace.name}
                      style={{ fontSize: "14px" }}
                    />
                    <span className="flex-1 truncate text-sm">
                      {workspace.name}
                    </span>
                    {activeWorkspace?.id === workspace.id && (
                      <Check className="text-primary h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            )}

            {/* Create New Workspace */}
            {onCreateWorkspace && (
              <>
                <DropdownMenuSeparator />
                <div className="py-1">
                  <DropdownMenuItem
                    onSelect={onCreateWorkspace}
                    className="text-primary flex items-center gap-2.5 px-2 py-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">New workspace</span>
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
              "rounded p-1 transition-colors",
              "hover:bg-sidebar-accent focus-visible:ring-sidebar-ring focus:outline-none focus-visible:ring-2"
            )}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconWrapper
              icon={isSidebarCollapsed ? ChevronsRight : ChevronsLeft}
              size="sm"
              className="text-sidebar-foreground/70"
            />
          </button>
        )}

        {/* New Page Button */}
        {onNewPage && (
          <button
            onClick={onNewPage}
            className={cn(
              "rounded p-1 transition-colors",
              "hover:bg-sidebar-accent focus-visible:ring-sidebar-ring focus:outline-none focus-visible:ring-2"
            )}
            title="New page"
          >
            <IconWrapper
              icon={SquarePen}
              size="sm"
              className="text-sidebar-foreground/70"
            />
          </button>
        )}
      </div>
    );
  }
);

WorkspaceHeader.displayName = "WorkspaceHeader";
