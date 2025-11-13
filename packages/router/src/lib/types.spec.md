# Module: lib/types.ts

Status: stable
Intent: Core domain type definitions for authentication, user management, and workspace functionality.

## Type Contracts

### Authentication Types

```ts
export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SendCodeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  error?: string;
}

export interface GetMeResponse {
  success: boolean;
  user?: User;
  error?: string;
}
```

### Workspace Types

```ts
export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  slug: string;
  plan?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  joinedAt: number;
  memberCount?: number;
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: number;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  token: string;
  expiresAt: number;
  createdAt: number;
  workspace?: {
    id: string;
    name: string;
    icon?: string;
  };
  inviter?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
}

export interface ListWorkspacesResponse {
  success: boolean;
  workspaces?: Workspace[];
  error?: string;
}

export interface CreateWorkspaceResponse {
  success: boolean;
  workspaceId?: string;
  error?: string;
}

export interface WorkspaceDetailsResponse {
  success: boolean;
  workspace?: Workspace;
  error?: string;
}
```

## Type Domains

### User & Authentication

- **User**: Minimal user identity (id, email)
- **AuthState**: Complete authentication state for context/store
- **Response types**: API response shapes with success/error patterns

### Workspace Management

- **Workspace**: Full workspace entity with role-based access control
- **WorkspaceMember**: User membership details within workspace
- **WorkspaceInvite**: Invitation token system for workspace access
- **WorkspaceState**: State shape for workspace context/store
- **Response types**: Consistent API response patterns

## Design Patterns

### Response Pattern

All API responses follow consistent structure:

```ts
{
  success: boolean;
  data?: T;        // Successful response data
  error?: string;  // Error message if failed
}
```

### Role-Based Access

Workspace roles define permission hierarchy:

- `owner` - Full control, cannot be removed
- `admin` - Management permissions
- `member` - Standard access
- `guest` - Limited read-only access

### Timestamp Format

All timestamps use Unix epoch milliseconds:

- `createdAt`: Entity creation time
- `updatedAt`: Last modification time
- `joinedAt`: User membership start time
- `expiresAt`: Expiration time for invites

## Type Safety Features

- **Strict role types**: Union types prevent invalid role values
- **Nullable fields**: Explicit null handling with `Type | null`
- **Optional fields**: Clear distinction with `?` for optional properties
- **Response discriminators**: `success` boolean enables type narrowing

## Dependencies

None - this is a foundational type module with no external dependencies.

## Usage Examples

### Authentication Flow

```ts
import type { AuthState, User, VerifyCodeResponse } from '@nouvelle/router';

// Context state
const [authState, setAuthState] = useState<AuthState>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
});

// API response handling
const handleVerify = async (response: VerifyCodeResponse) => {
  if (response.success && response.user && response.token) {
    setAuthState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      isLoading: false,
    });
  }
};
```

### Workspace Management

```ts
import type { Workspace, WorkspaceState } from '@nouvelle/router';

// Workspace state
const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
  workspaces: [],
  activeWorkspace: null,
  isLoading: true,
});

// Role-based permission check
const canManageWorkspace = (workspace: Workspace): boolean => {
  return workspace.role === 'owner' || workspace.role === 'admin';
};
```

### Invite System

```ts
import type { WorkspaceInvite } from '@nouvelle/router';

// Check if invite is expired
const isInviteValid = (invite: WorkspaceInvite): boolean => {
  return Date.now() < invite.expiresAt;
};
```

## Validation Considerations

While TypeScript provides compile-time type safety, consider runtime validation for:

- **Email format**: Validate email strings match RFC 5322
- **Timestamp validity**: Ensure timestamps are positive and reasonable
- **Role values**: Verify role strings match allowed values
- **UUID format**: Validate id fields match UUID format
- **Token security**: Validate token format and expiration

## Future Improvements

- **Add Page types**: Define types for page entities and hierarchies
- **Add Permission types**: Granular permission system beyond roles
- **Add Activity types**: User activity tracking and audit logs
- **Add Settings types**: User and workspace settings structures
- **Add Notification types**: In-app notification system types
- **Zod schemas**: Runtime validation matching TypeScript types
- **Branded types**: Nominal typing for IDs to prevent mixing

## Related Files

- `auth-context.tsx` - Uses AuthState, User types
- `workspace-context.tsx` - Uses WorkspaceState, Workspace types
- `api-client.ts` - Uses all response types
- `query-client.ts` - React Query integration with these types

Last updated: 2025-11-12