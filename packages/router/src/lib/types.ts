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

// Workspace types
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
