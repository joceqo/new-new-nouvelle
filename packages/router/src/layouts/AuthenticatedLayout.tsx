import { Outlet, useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  CreateWorkspaceDialog,
  InviteMembersDialog,
  WorkspaceSettingsDialog,
  PageTree,
} from "@nouvelle/ui";
import { useAuth } from "../lib/auth-context";
import { useWorkspace } from "../lib/workspace-context";
import { usePage } from "../lib/page-context";
import { useState } from "react";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
  } = useWorkspace();
  const { pages, createPage, toggleFavorite, deletePage, updatePage } =
    usePage();

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  // Handlers
  const handleCreateWorkspace = async (name: string, icon?: string) => {
    await createWorkspace(name, icon);
  };

  const handleInviteMembers = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowInviteDialog(true);
  };

  const handleInviteMember = async (email: string) => {
    if (!selectedWorkspaceId)
      return { success: false, error: "No workspace selected" };
    return await inviteMember(selectedWorkspaceId, email);
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowSettingsDialog(true);
  };

  const handleUpdateWorkspace = async (
    workspaceId: string,
    updates: { name?: string; icon?: string }
  ): Promise<boolean> => {
    const result = await updateWorkspace(workspaceId, updates);
    return result.success;
  };

  const handleDeleteWorkspace = async (
    workspaceId: string
  ): Promise<boolean> => {
    const result = await deleteWorkspace(workspaceId);
    return result.success;
  };

  const selectedWorkspace = workspaces.find(
    (w) => w.id === selectedWorkspaceId
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
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
        {/* Pages Section */}
        <PageTree
          title="Pages"
          pages={pages}
          showSearch={true}
          onPageSelect={(pageId: string) =>
            navigate({ to: "/page/$pageId", params: { pageId } })
          }
          onPageCreate={(parentId?: string) => createPage("Untitled", parentId)}
          onToggleFavorite={(pageId: string) => toggleFavorite(pageId)}
          onPageDelete={(pageId: string) => deletePage(pageId)}
          onPageRename={(pageId: string) => {
            const newTitle = prompt("Enter new title:");
            if (newTitle) updatePage(pageId, { title: newTitle });
          }}
        />
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      {/* Workspace Dialogs */}
      <CreateWorkspaceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateWorkspace={handleCreateWorkspace}
      />

      <InviteMembersDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        workspaceName={selectedWorkspace?.name || ""}
        onInviteMember={handleInviteMember}
      />

      <WorkspaceSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        workspace={selectedWorkspace || null}
        onUpdateWorkspace={handleUpdateWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
      />
    </div>
  );
}
