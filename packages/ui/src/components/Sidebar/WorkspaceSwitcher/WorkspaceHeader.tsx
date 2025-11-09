import * as React from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  SquarePen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { WorkspaceIcon } from "@/components/Sidebar/WorkspaceSwitcher/WorkspaceIcon";
import { IconWrapper } from "@/components/IconWrapper/IconWrapper";
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
      onLogout,
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
          "group hover:bg-[var(--sidebar-header-hover-bg)]",
          "transition-colors duration-150",
          className
        )}
      >
        {/* Workspace Switcher Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-0.5 text-sm cursor-pointer",
                "text-[var(--sidebar-header-text)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-blue-text)] focus-visible:ring-offset-1",
                "transition-colors duration-150"
              )}
            >
              <WorkspaceIcon
                value={activeWorkspace?.icon || activeWorkspace?.name}
                className="shrink-0"
                style={{ fontSize: "16px" }}
              />
              <span className="flex-1 truncate text-left font-medium">
                {activeWorkspace?.name || "Select workspace"}
              </span>

              <IconWrapper
                icon={ChevronDown}
                className={cn(
                  "h-4 w-4 shrink-0 text-[var(--sidebar-header-icon)] transition-all duration-200",
                  "group-hover:text-[var(--sidebar-header-icon-hover)]",
                  dropdownOpen && "rotate-180"
                )}
                variant="button"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="bottom"
            sideOffset={4}
            className="w-64 rounded-lg border-[var(--color-border)] bg-[var(--color-bg-base)] p-2 shadow-md"
          >
            {/* Workspace List */}
            {workspaces.length > 0 && (
              <div className="space-y-0.5">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onSelect={() => {
                      onWorkspaceChange(workspace.id);
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-hover-subtle)] focus:bg-[var(--color-hover-subtle)]"
                  >
                    <WorkspaceIcon
                      value={workspace.icon || workspace.name}
                      style={{ fontSize: "14px" }}
                    />
                    <span className="flex-1 truncate text-sm">
                      {workspace.name}
                    </span>
                    {activeWorkspace?.id === workspace.id && (
                      <Check className="h-4 w-4 text-[var(--palette-blue-text)]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            )}

            {/* Create New Workspace */}
            {onCreateWorkspace && (
              <>
                <DropdownMenuSeparator className="my-1 bg-[var(--color-divider)]" />
                <div>
                  <DropdownMenuItem
                    onSelect={onCreateWorkspace}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[var(--palette-blue-text)] transition-colors duration-150 hover:bg-[var(--color-hover-subtle)] focus:bg-[var(--color-hover-subtle)]"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">New workspace</span>
                  </DropdownMenuItem>
                </div>
              </>
            )}

            {/* Logout */}
            {onLogout && (
              <>
                <DropdownMenuSeparator className="my-1 bg-[var(--color-divider)]" />
                <div>
                  <DropdownMenuItem
                    onSelect={onLogout}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-red-600 transition-colors duration-150 hover:bg-[var(--color-hover-subtle)] focus:bg-[var(--color-hover-subtle)] dark:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Log out</span>
                  </DropdownMenuItem>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse Sidebar Toggle */}
        {onToggleSidebar && (
          <IconWrapper
            variant="button"
            icon={isSidebarCollapsed ? ChevronsRight : ChevronsLeft}
            size="sm"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          />
        )}

        {/* New Page Button */}
        {onNewPage && (
          <IconWrapper
            variant="button"
            icon={SquarePen}
            size="sm"
            onClick={onNewPage}
            title="New page"
          />
        )}
      </div>
    );
  }
);

WorkspaceHeader.displayName = "WorkspaceHeader";
