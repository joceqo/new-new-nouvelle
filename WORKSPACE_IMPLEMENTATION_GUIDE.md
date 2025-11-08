# Workspace Switching Implementation Guide

This guide explains how to use the Notion-like workspace switching system that has been implemented.

## Overview

The workspace system provides:
- **Multi-workspace support** - Users can belong to and switch between multiple workspaces
- **Notion-style UI** - WorkspaceSwitcher component matching Notion's design
- **Complete invite system** - Email invites + shareable links
- **Workspace management** - Create, update, delete workspaces
- **Role-based permissions** - owner, admin, member, guest roles
- **Auto-workspace creation** - Every new user gets a personal workspace

---

## Quick Start

### 1. Basic Sidebar with Workspace Switching

```tsx
import { Sidebar } from '@nouvelle/ui';
import { useWorkspace, useAuth } from '@nouvelle/router';

function App() {
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
  const { user, logout } = useAuth();

  return (
    <Sidebar
      workspaces={workspaces}
      activeWorkspace={activeWorkspace}
      onWorkspaceChange={switchWorkspace}
      userEmail={user?.email}
      onLogout={logout}
    >
      {/* Your sidebar content */}
    </Sidebar>
  );
}
```

---

## Complete Example with All Features

```tsx
import React, { useState } from 'react';
import {
  Sidebar,
  CreateWorkspaceDialog,
  InviteMembersDialog,
  WorkspaceSettingsDialog,
} from '@nouvelle/ui';
import { useWorkspace, useAuth } from '@nouvelle/router';

function WorkspaceApp() {
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
    isLoading,
  } = useWorkspace();

  const { user, logout } = useAuth();

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  // Handlers
  const handleCreateWorkspace = async (name: string, icon?: string) => {
    const workspaceId = await createWorkspace(name, icon);
    if (workspaceId) {
      console.log('Workspace created:', workspaceId);
    }
  };

  const handleInviteMember = async (email: string) => {
    if (!activeWorkspace) return { success: false, error: 'No active workspace' };
    return await inviteMember(activeWorkspace.id, email);
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

  const handleWorkspaceSettings = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowSettingsDialog(true);
  };

  const handleInviteMembers = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowInviteDialog(true);
  };

  const selectedWorkspace = workspaces.find(w => w.id === selectedWorkspaceId);

  return (
    <div className="flex h-screen">
      {/* Sidebar with WorkspaceSwitcher */}
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
        {/* Your sidebar navigation items */}
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <h1>Welcome to {activeWorkspace?.name || 'Your Workspace'}</h1>
        <p>Workspace ID: {activeWorkspace?.id}</p>
        <p>Your role: {activeWorkspace?.role}</p>
        <p>Members: {activeWorkspace?.memberCount || 1}</p>
      </main>

      {/* Dialogs */}
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
    </div>
  );
}

export default WorkspaceApp;
```

---

## API Reference

### Workspace Hook: `useWorkspace()`

```tsx
const {
  // State
  workspaces,         // Workspace[] - All workspaces user belongs to
  activeWorkspace,    // Workspace | null - Currently active workspace
  isLoading,          // boolean - Loading state

  // Actions
  switchWorkspace,    // (workspaceId: string) => void
  createWorkspace,    // (name: string, icon?: string) => Promise<string | null>
  updateWorkspace,    // (id: string, updates: {...}) => Promise<boolean>
  deleteWorkspace,    // (id: string) => Promise<boolean>
  inviteMember,       // (workspaceId: string, email: string) => Promise<{...}>
  refreshWorkspaces,  // () => Promise<void>
} = useWorkspace();
```

### Workspace Type

```tsx
interface Workspace {
  id: string;
  name: string;
  icon?: string;
  slug: string;
  plan?: string;           // "free", "pro", "enterprise"
  role: 'owner' | 'admin' | 'member' | 'guest';
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  joinedAt: number;
  memberCount?: number;
}
```

---

## Components

### 1. WorkspaceSwitcher

Notion-style dropdown for switching workspaces.

```tsx
<WorkspaceSwitcher
  workspaces={workspaces}
  activeWorkspace={activeWorkspace}
  onWorkspaceChange={(id) => switchWorkspace(id)}
  onCreateWorkspace={() => setShowCreateDialog(true)}
  onWorkspaceSettings={(id) => console.log('Settings:', id)}
  onInviteMembers={(id) => console.log('Invite:', id)}
  onLogout={logout}
  userEmail="user@example.com"
/>
```

**Features:**
- Workspace list with checkmark on active
- Plan info and member count display
- Settings and Invite buttons
- Create new workspace option
- Logout functionality

### 2. CreateWorkspaceDialog

Modal for creating new workspaces.

```tsx
<CreateWorkspaceDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  onCreateWorkspace={async (name, icon) => {
    const id = await createWorkspace(name, icon);
    console.log('Created:', id);
  }}
/>
```

**Features:**
- Workspace name input
- Emoji icon picker (15 default icons)
- Form validation
- Loading states

### 3. InviteMembersDialog

Modal for inviting members to workspace.

```tsx
<InviteMembersDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  workspaceName="My Workspace"
  onInviteMember={async (email) => {
    const result = await inviteMember(workspaceId, email);
    return result;
  }}
/>
```

**Features:**
- Email invite input with validation
- Shareable invite link generation
- Copy link button
- Success/error messages
- Invite expiration info (7 days)

### 4. WorkspaceSettingsDialog

Modal for workspace settings and deletion.

```tsx
<WorkspaceSettingsDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  workspace={activeWorkspace}
  onUpdateWorkspace={async (id, updates) => {
    return await updateWorkspace(id, updates);
  }}
  onDeleteWorkspace={async (id) => {
    return await deleteWorkspace(id);
  }}
/>
```

**Features:**
- Edit workspace name and icon
- Role-based permissions (only owner/admin can edit)
- Delete workspace (owner only)
- Confirmation dialog for deletion
- Current workspace info display

---

## Invite System

### Sending Invites

```tsx
// Via dialog
<InviteMembersDialog ... />

// Programmatically
const result = await inviteMember(workspaceId, 'user@example.com');
if (result.success && result.inviteLink) {
  console.log('Share this link:', result.inviteLink);
}
```

### Accepting Invites

Users navigate to `/invite/{token}` to accept invites.

The `InvitePage` component:
1. Checks if user is authenticated (redirects to login if not)
2. Accepts the invite automatically
3. Adds user to workspace
4. Refreshes workspace list
5. Switches to new workspace
6. Redirects to home

**URL Format:**
```
https://yourapp.com/invite/abc123xyz456
```

---

## Permissions

### Role Hierarchy

| Role   | Can View | Can Edit Pages | Can Invite | Can Edit Settings | Can Delete |
|--------|----------|----------------|------------|-------------------|------------|
| Owner  | ✅       | ✅             | ✅         | ✅                | ✅         |
| Admin  | ✅       | ✅             | ✅         | ✅                | ❌         |
| Member | ✅       | ✅             | ❌         | ❌                | ❌         |
| Guest  | ✅       | ❌             | ❌         | ❌                | ❌         |

### Checking Permissions

```tsx
const canInvite = activeWorkspace?.role === 'owner' || activeWorkspace?.role === 'admin';
const canDelete = activeWorkspace?.role === 'owner';
```

---

## Data Flow

### 1. User Signs Up
- User creates account → API creates personal workspace automatically
- Workspace is created with name: `{email}'s Workspace`
- User is added as owner

### 2. User Logs In
- Auth context loads user data
- Workspace context fetches all workspaces user belongs to
- Active workspace is set from localStorage or defaults to first workspace
- Workspace state syncs across components

### 3. User Switches Workspace
```
switchWorkspace(id)
  → Update context state
  → Save to localStorage
  → UI updates automatically
```

### 4. User Creates Workspace
```
createWorkspace(name, icon)
  → API creates workspace
  → User added as owner
  → Refresh workspaces list
  → Return workspace ID
```

### 5. User Invites Member
```
inviteMember(workspaceId, email)
  → API creates invite record
  → Generate token
  → Send email (optional)
  → Return shareable link
```

### 6. Member Accepts Invite
```
/invite/{token}
  → Check authentication
  → Accept invite via API
  → Add user to workspace
  → Refresh workspaces
  → Switch to new workspace
  → Redirect to home
```

---

## Styling

The workspace components use Tailwind CSS and match Notion's design:

- **Colors:** Gray scale with blue accents
- **Border radius:** rounded-xl for dialogs, rounded-md for buttons
- **Shadows:** Soft shadows on dropdowns and dialogs
- **Typography:** Inter font family (system default)
- **Spacing:** Consistent padding and gaps
- **Animations:** Fade-in and zoom-in effects

### Customization

You can customize the components by:

1. **Override Tailwind classes:**
```tsx
<WorkspaceSwitcher className="custom-class" />
```

2. **Theme variables:**
```css
:root {
  --sidebar-bg: #fafafa;
  --sidebar-item-text: #37352f;
}
```

---

## Testing

### Manual Testing Checklist

- [ ] User signup creates personal workspace
- [ ] User can see workspace list
- [ ] User can switch between workspaces
- [ ] Active workspace persists on reload
- [ ] User can create new workspace
- [ ] User can update workspace name/icon
- [ ] User can invite member via email
- [ ] Invite link is generated and copyable
- [ ] Member can accept invite
- [ ] Member is added to workspace
- [ ] Owner can delete workspace
- [ ] Non-owner cannot delete workspace
- [ ] UI matches Notion's design
- [ ] Mobile responsive

### API Endpoints to Test

```bash
# List workspaces
GET /workspaces
Authorization: Bearer {token}

# Get workspace
GET /workspaces/{id}
Authorization: Bearer {token}

# Create workspace
POST /workspaces
Authorization: Bearer {token}
Body: { "name": "Test Workspace", "icon": "🚀" }

# Update workspace
PATCH /workspaces/{id}
Authorization: Bearer {token}
Body: { "name": "Updated Name" }

# Delete workspace
DELETE /workspaces/{id}
Authorization: Bearer {token}

# Invite member
POST /workspaces/{id}/invite
Authorization: Bearer {token}
Body: { "email": "user@example.com" }

# Accept invite
POST /workspaces/invite/{token}/accept
Authorization: Bearer {token}
```

---

## Troubleshooting

### Workspace not showing after creation
- Check if `refreshWorkspaces()` is called after creation
- Verify API endpoint is returning workspace correctly
- Check browser console for errors

### Invite link not working
- Verify token is valid and not expired (7 days)
- Check if user is authenticated before accepting
- Ensure API workspace invite endpoint is accessible

### Active workspace not persisting
- Check localStorage for `nouvelle_active_workspace_id`
- Verify WorkspaceProvider is wrapping the app
- Ensure auth token is valid

### Permission errors
- Verify user's role in workspace
- Check workspace membership in database
- Ensure API is validating permissions correctly

---

## Next Steps

To extend the workspace system:

1. **Add workspace templates** - Pre-configured workspace setups
2. **Workspace settings** - Custom colors, logos, domains
3. **Advanced permissions** - Page-level or feature-level permissions
4. **Workspace analytics** - Usage stats, member activity
5. **Billing integration** - Upgrade to paid plans
6. **Public workspaces** - Allow public access to certain workspaces
7. **Workspace export** - Export all workspace data

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the example implementation
- Check browser console for error messages
- Verify API responses in Network tab

---

## File Locations

**Backend (Database & API):**
- `packages/convex/convex/schema.ts` - Database schema
- `packages/convex/convex/workspaces.ts` - Workspace CRUD
- `packages/convex/convex/workspace_members.ts` - Membership management
- `packages/convex/convex/workspace_invites.ts` - Invite system
- `apps/api/src/routes/workspaces.ts` - API endpoints

**Frontend (State & Context):**
- `packages/router/src/lib/workspace-context.tsx` - Workspace state
- `packages/router/src/lib/api-client.ts` - API client
- `packages/router/src/lib/types.ts` - TypeScript types
- `apps/web/src/main.tsx` - App entry with providers

**UI Components:**
- `packages/ui/src/components/WorkspaceSwitcher/` - Switcher component
- `packages/ui/src/components/WorkspaceDialogs/` - Dialog components
- `packages/ui/src/components/ui/dropdown-menu.tsx` - Dropdown primitive
- `packages/ui/src/components/ui/avatar.tsx` - Avatar component
- `packages/ui/src/components/ui/badge.tsx` - Badge component
- `packages/ui/src/components/ui/dialog.tsx` - Dialog primitive

**Pages:**
- `packages/router/src/pages/invite/InvitePage.tsx` - Invite acceptance page
- `packages/router/src/route-tree.tsx` - Route definitions

---

## Summary

The workspace switching system is now fully implemented with:
- ✅ Multi-workspace support
- ✅ Notion-style UI
- ✅ Complete invite system
- ✅ Role-based permissions
- ✅ Workspace management (CRUD)
- ✅ Auto-workspace creation on signup
- ✅ State persistence
- ✅ Type-safe API client

Everything is ready to use! 🎉
