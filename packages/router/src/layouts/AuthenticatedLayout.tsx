import { Outlet, useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  CreateWorkspaceDialog,
  InviteMembersDialog,
  WorkspaceSettingsDialog,
  PageTree,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Inbox,
} from "@nouvelle/ui";
import { useAuth } from "../lib/auth-context";
import { useWorkspace } from "../lib/workspace-context";
import { usePage } from "../lib/page-context";
import { createPageSlug } from "../lib/notion-url";
import { useState, useEffect } from "react";
import { Search, FileText, Home, Settings } from "lucide-react";

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

  // Command and Inbox states
  const [showCommand, setShowCommand] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

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

  // Helper function to navigate to a page with Notion-style URL
  const navigateToPage = (pageId: string) => {
    // Find the page in the tree (flattened search)
    const findPageById = (pages: any[], id: string): any => {
      for (const page of pages) {
        if (page.id === id) return page;
        if (page.children) {
          const found = findPageById(page.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const page = findPageById(pages, pageId);
    if (page) {
      const slug = createPageSlug(page.title, page.id);
      navigate({ to: "/$pageSlug", params: { pageSlug: slug } });
    }
  };

  // Cmd+K shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommand(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter pages based on search query
  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(commandQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background" data-testid="authenticated-layout">
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
        onSearchClick={() => setShowCommand(true)}
        onHomeClick={() => navigate({ to: "/home" })}
        onInboxClick={() => setShowInbox(true)}
      >
        {/* Pages Section */}
        <PageTree
          title="Pages"
          pages={pages}
          onPageSelect={navigateToPage}
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

      {/* Command Palette */}
      <Command open={showCommand} onOpenChange={setShowCommand}>
        <CommandInput
          placeholder="Search pages..."
          value={commandQuery}
          onChange={(e) => setCommandQuery(e.target.value)}
        />
        <CommandList>
          {filteredPages.length === 0 && commandQuery && (
            <CommandEmpty>No pages found</CommandEmpty>
          )}

          {filteredPages.length > 0 && (
            <CommandGroup heading="Pages">
              {filteredPages.map((page) => (
                <CommandItem
                  key={page.id}
                  onSelect={() => {
                    navigateToPage(page.id);
                    setCommandQuery("");
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{page.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!commandQuery && (
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => navigate({ to: "/home" })}>
                <Home className="mr-2 h-4 w-4" />
                <span>Go to Home</span>
              </CommandItem>
              <CommandItem onSelect={() => createPage("Untitled")}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Create new page</span>
              </CommandItem>
              <CommandItem onSelect={() => setShowSettingsDialog(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Workspace settings</span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </Command>

      {/* Inbox Sheet */}
      <Inbox open={showInbox} onOpenChange={setShowInbox} />
    </div>
  );
}
