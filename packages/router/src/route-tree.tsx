import { RootRoute, Outlet, createRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { LoginPage } from "./pages/login/LoginPage";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { MagicLinkPage } from "./pages/auth/MagicLinkPage";
import { GettingStartedPage } from "./pages/getting-started/GettingStartedPage";
import { InvitePage } from "./pages/invite/InvitePage";
import {
  Sidebar,
  CreateWorkspaceDialog,
  InviteMembersDialog,
  WorkspaceSettingsDialog,
  SidebarItem,
} from "@nouvelle/ui";
import { useAuth } from "./lib/auth-context";
import { useWorkspace } from "./lib/workspace-context";
import { useState } from "react";
import { FileText, List, CalendarDays, User } from "lucide-react";

// Layout component with Sidebar
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
  } = useWorkspace();

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  // Pages that shouldn't show the sidebar
  const noSidebarPaths = ['/', '/login', '/onboarding', '/auth/magic-link', '/invite'];
  const shouldHideSidebar = noSidebarPaths.some(path =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  );

  // Don't show sidebar on login/auth/onboarding pages
  const shouldShowSidebar = isAuthenticated && !shouldHideSidebar;

  // Handlers
  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  const handleCreateWorkspace = async (name: string, icon?: string) => {
    await createWorkspace(name, icon);
  };

  const handleInviteMembers = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowInviteDialog(true);
  };

  const handleInviteMember = async (email: string) => {
    if (!selectedWorkspaceId) return { success: false, error: 'No workspace selected' };
    return await inviteMember(selectedWorkspaceId, email);
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowSettingsDialog(true);
  };

  const handleUpdateWorkspace = async (
    workspaceId: string,
    updates: { name?: string; icon?: string }
  ) => {
    return await updateWorkspace(workspaceId, updates);
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    return await deleteWorkspace(workspaceId);
  };

  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {shouldShowSidebar && (
        <Sidebar
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          onWorkspaceChange={switchWorkspace}
          onCreateWorkspace={() => setShowCreateDialog(true)}
          onWorkspaceSettings={handleWorkspaceSettings}
          onInviteMembers={handleInviteMembers}
          userEmail={user?.email}
          onLogout={logout}
        >
          {/* Private Section */}
          <div className="mb-2">
            <div className="px-2 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Private
              </span>
            </div>
            <SidebarItem icon={FileText} label="Getting Started" isActive />
            <SidebarItem icon={List} label="To Do List" />
            <SidebarItem icon={CalendarDays} label="Weekly To-do List" />
          </div>

          {/* Shared Section */}
          <div>
            <div className="px-2 mb-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Shared
              </span>
            </div>
            <SidebarItem icon={User} label="Start collaborating" />
          </div>
        </Sidebar>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      {/* Workspace Dialogs */}
      {shouldShowSidebar && (
        <>
          <CreateWorkspaceDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onCreateWorkspace={handleCreateWorkspace}
          />

          <InviteMembersDialog
            open={showInviteDialog}
            onOpenChange={setShowInviteDialog}
            workspaceName={selectedWorkspace?.name || ''}
            onInviteMember={handleInviteMember}
          />

          <WorkspaceSettingsDialog
            open={showSettingsDialog}
            onOpenChange={setShowSettingsDialog}
            workspace={selectedWorkspace || null}
            onUpdateWorkspace={handleUpdateWorkspace}
            onDeleteWorkspace={handleDeleteWorkspace}
          />
        </>
      )}
    </div>
  );
}

// Root route - this is the layout wrapper for all routes
export const rootRoute = new RootRoute({
  component: AppLayout,
});

// Index route - redirect to login page
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

// Example: About route
export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => <div>About Page</div>,
});

// Example: Dynamic route with params
export const documentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents/$documentId",
  component: () => <div>Document View</div>,
});

// Example: Editor route
export const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor",
  component: () => <div>Editor</div>,
});

// Login route
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Onboarding route
export const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

// Magic link verification route
export const magicLinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/magic-link",
  component: MagicLinkPage,
});

// Getting Started route
export const gettingStartedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/getting-started/$pageId",
  component: GettingStartedPage,
});

// Workspace invite acceptance route
export const inviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invite/$token",
  component: InvitePage,
});

// Create the route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  documentRoute,
  editorRoute,
  loginRoute,
  onboardingRoute,
  magicLinkRoute,
  gettingStartedRoute,
  inviteRoute,
]);

// Export route IDs type for type-safe navigation
export type RouteTree = typeof routeTree;
