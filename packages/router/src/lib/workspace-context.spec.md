# Module: lib/workspace-context.tsx

Status: stable
Intent: Workspace management with active workspace tracking, CRUD operations, member invitations, and localStorage persistence.

## Exports

```ts
export function WorkspaceProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function useWorkspace(): WorkspaceContextValue;

interface WorkspaceContextValue extends WorkspaceState {
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, icon?: string) => Promise<{ success: boolean; workspaceId?: string; error?: string }>;
  refreshWorkspaces: () => Promise<void>;
  updateWorkspace: (workspaceId: string, updates: { name?: string; icon?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteWorkspace: (workspaceId: string) => Promise<{ success: boolean; error?: string }>;
  inviteMember: (workspaceId: string, email: string) => Promise<{ success: boolean; inviteLink?: string; error?: string }>;
  clearError: () => void;
}
```

## Purpose & Behavior

### Core Functionality

- **Workspace list management**: Fetches and caches user's accessible workspaces
- **Active workspace tracking**: Maintains currently selected workspace
- **Persistence**: Stores active workspace ID in localStorage
- **Full CRUD**: Create, update, delete workspace operations
- **Member invitations**: Generate and send workspace invite links
- **React Query integration**: Automatic caching and revalidation

### Active Workspace Selection

1. **On load**: Check localStorage for previously active workspace
2. **Validate**: Ensure saved workspace still exists in user's workspace list
3. **Fallback**: If invalid, select first available workspace
4. **Auto-save**: Persist selection to localStorage on change

## Component Contract

### WorkspaceProvider

```tsx
<WorkspaceProvider>
  {/* Components that need workspace data */}
</WorkspaceProvider>
```

**Props**: `children` - React components to wrap with workspace context

**Dependencies**: Must be wrapped by `AuthProvider`

**Behavior**:
- Fetches workspaces when user authenticates
- Prevents race conditions by checking auth loading state
- Automatically refetches on auth state change

### useWorkspace Hook

```ts
const { workspaces, activeWorkspace, isLoading, switchWorkspace, createWorkspace, ... } = useWorkspace();
```

**Returns**: `WorkspaceContextValue` object with data and methods

**Throws**: Error if used outside `WorkspaceProvider`

## State Management

### Storage Keys

- `nouvelle_active_workspace_id` - Currently selected workspace ID

### React Query Configuration

```ts
{
  queryKey: ['workspaces', token],
  enabled: !!token && isAuthenticated && !authLoading,
  staleTime: 1 * 60 * 1000,     // 1 minute
  gcTime: 5 * 60 * 1000,        // 5 minutes
}
```

**Key insight**: Prevents race condition by waiting for auth to complete

## Methods

### switchWorkspace(workspaceId)

**Purpose**: Change active workspace

**Parameters**: `workspaceId` - Target workspace ID

**Side effects**:
- Updates localStorage
- Updates React Query cache
- Triggers re-render of dependent components
- Logs switch event for debugging

**Validation**: Checks workspace exists in user's workspace list

### createWorkspace(name, icon?)

**Purpose**: Create new workspace and set as active

**Parameters**:
- `name` - Workspace name
- `icon` - Optional emoji icon

**Returns**: `{ success: boolean; workspaceId?: string; error?: string }`

**Side effects**: Invalidates workspace queries for automatic UI update

### refreshWorkspaces()

**Purpose**: Manual refetch of workspace list

**Use case**: After external changes or user request

### updateWorkspace(workspaceId, updates)

**Purpose**: Update workspace properties

**Parameters**:
- `workspaceId` - Target workspace ID
- `updates` - `{ name?: string; icon?: string }`

**Permissions**: Requires owner or admin role

### deleteWorkspace(workspaceId)

**Purpose**: Permanently delete workspace

**Warning**: Deletes all workspace data (pages, members, etc.)

**Permissions**: Requires owner role

### inviteMember(workspaceId, email)

**Purpose**: Generate invite link and optionally send invitation email

**Parameters**:
- `workspaceId` - Workspace to invite to
- `email` - Invitee email address

**Returns**: `{ success: boolean; inviteLink?: string; error?: string }`

**Permissions**: Requires owner or admin role

### clearError()

**Purpose**: Reset query error state

**Implementation**: Calls `queryClient.resetQueries()`

## API Endpoints

```ts
GET    /workspaces              // List user workspaces
POST   /workspaces              // Create workspace
PATCH  /workspaces/:id          // Update workspace
DELETE /workspaces/:id          // Delete workspace
POST   /workspaces/:id/invite   // Invite member
```

## Dependencies

- `react` - Context, hooks, component model
- `@tanstack/react-query` - Query and mutation management
- `./types` - Workspace, WorkspaceState types
- `./api-client` - workspaceApiClient
- `./auth-context` - Token and auth state

## Usage Examples

### App Setup

```tsx
import { AuthProvider, WorkspaceProvider } from '@nouvelle/router';

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <RouterProvider router={router} />
      </WorkspaceProvider>
    </AuthProvider>
  );
}
```

### Workspace Switcher

```tsx
import { useWorkspace } from '@nouvelle/router';

function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();

  return (
    <Select
      value={activeWorkspace?.id}
      onValueChange={switchWorkspace}
    >
      {workspaces.map(workspace => (
        <SelectItem key={workspace.id} value={workspace.id}>
          {workspace.icon} {workspace.name}
        </SelectItem>
      ))}
    </Select>
  );
}
```

### Create Workspace Dialog

```tsx
const { createWorkspace } = useWorkspace();

const handleCreate = async (name: string, icon: string) => {
  const result = await createWorkspace(name, icon);
  if (result.success) {
    toast.success('Workspace created!');
    closeDialog();
  } else {
    toast.error(result.error);
  }
};
```

### Invite Members

```tsx
const { inviteMember } = useWorkspace();

const handleInvite = async (email: string) => {
  const result = await inviteMember(workspaceId, email);
  if (result.success) {
    toast.success(`Invitation sent to ${email}`);
    if (result.inviteLink) {
      console.log('Invite link:', result.inviteLink);
    }
  } else {
    toast.error(result.error);
  }
};
```

### Workspace Settings

```tsx
const { activeWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();

function WorkspaceSettings() {
  const handleUpdate = async (updates: { name: string; icon: string }) => {
    await updateWorkspace(activeWorkspace!.id, updates);
  };

  const handleDelete = async () => {
    if (confirm('Delete workspace? This cannot be undone.')) {
      await deleteWorkspace(activeWorkspace!.id);
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Settings for {activeWorkspace?.name}</h2>
      <WorkspaceForm onSubmit={handleUpdate} />
      <Button variant="destructive" onClick={handleDelete}>
        Delete Workspace
      </Button>
    </div>
  );
}
```

## Performance Characteristics

- **Initial load**: Single API request for workspace list
- **Stale time**: 1 minute before revalidation
- **Cache persistence**: 5 minutes after component unmount
- **Switch speed**: Instant (cache update only)
- **Mutation updates**: Automatic refetch only on success

## Role-Based Access Control

Workspace roles from `lib/types.ts`:

- **owner**: Full control, can delete workspace
- **admin**: Manage members, settings (cannot delete)
- **member**: Standard access to workspace content
- **guest**: Limited read-only access

Role checks should be performed before calling update/delete/invite methods.

## Race Condition Prevention

The query is only enabled when:
```ts
enabled: !!token && isAuthenticated && !authLoading
```

This prevents:
- Fetching workspaces before authentication completes
- Race conditions between auth and workspace queries
- Unnecessary API calls during auth loading

## Error Handling

- **Network errors**: Logged and returned as error message
- **Auth errors**: Automatically handled by auth context
- **Permission errors**: Returned as error message for user feedback
- **Not found errors**: Returns empty workspace list

## Cross-Tab Sync

**Current state**: Active workspace stored in localStorage but no sync mechanism

**Limitation**: Changing workspace in one tab doesn't update other tabs

**Future improvement**: Add storage event listener for cross-tab sync

## Future Improvements

- **Cross-tab sync**: Listen to localStorage events for workspace changes
- **Workspace templates**: Create workspaces from templates
- **Workspace export/import**: Backup and restore workspace data
- **Team workspaces**: Organization-level workspaces above user workspaces
- **Workspace analytics**: Usage stats and activity tracking
- **Custom roles**: Define custom permission roles beyond preset roles
- **Workspace settings**: Per-workspace preferences and configuration
- **Workspace search**: Search across all workspaces

## Related Files

- Uses: `lib/types.ts` - Workspace, WorkspaceState types
- Uses: `lib/api-client.ts` - workspaceApiClient
- Uses: `lib/auth-context.tsx` - Token and auth state
- Used by: `page-context.tsx` - Depends on active workspace
- Used by: Workspace switcher, settings dialogs, navigation components

Last updated: 2025-11-12
