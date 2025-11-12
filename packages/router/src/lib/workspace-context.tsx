import React, { createContext, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { WorkspaceState } from './types';
import { workspaceApiClient } from './api-client';
import { useAuth } from './auth-context';

interface WorkspaceContextValue extends WorkspaceState {
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, icon?: string) => Promise<{ success: boolean; workspaceId?: string; error?: string }>;
  refreshWorkspaces: () => Promise<void>;
  updateWorkspace: (workspaceId: string, updates: { name?: string; icon?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteWorkspace: (workspaceId: string) => Promise<{ success: boolean; error?: string }>;
  inviteMember: (workspaceId: string, email: string) => Promise<{ success: boolean; inviteLink?: string; error?: string }>;
  clearError: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const ACTIVE_WORKSPACE_KEY = 'nouvelle_active_workspace_id';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Query for workspaces - only runs when authenticated
  const {
    data: workspacesData,
    isLoading: workspacesLoading,
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ['workspaces', token],
    queryFn: async () => {
      if (!token || !isAuthenticated) {
        console.log('[WORKSPACE] No token or not authenticated, returning empty');
        return { workspaces: [], activeWorkspace: null };
      }

      console.log('[WORKSPACE] Fetching workspaces...');
      const response = await workspaceApiClient.listWorkspaces(token);
      console.log('[WORKSPACE] API Response:', response);

      if (response.success && response.workspaces) {
        const workspaces = response.workspaces;
        const savedActiveId = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
        const activeWorkspace = workspaces.find(w => w.id === savedActiveId) || workspaces[0] || null;

        if (activeWorkspace) {
          localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeWorkspace.id);
        }

        console.log('[WORKSPACE] Workspaces loaded:', {
          count: workspaces.length,
          activeWorkspaceId: activeWorkspace?.id,
        });

        return { workspaces, activeWorkspace };
      }

      console.log('[WORKSPACE] No workspaces found or request failed');
      return { workspaces: [], activeWorkspace: null };
    },
    enabled: !!token && isAuthenticated && !authLoading, // THIS FIXES THE RACE CONDITION
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create workspace mutation
  const createWorkspaceMutation = useMutation({
    mutationFn: async ({ name, icon }: { name: string; icon?: string }) => {
      if (!token) throw new Error('Not authenticated');
      return workspaceApiClient.createWorkspace(name, token, icon);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  // Update workspace mutation
  const updateWorkspaceMutation = useMutation({
    mutationFn: async ({ workspaceId, updates }: { workspaceId: string; updates: { name?: string; icon?: string } }) => {
      if (!token) throw new Error('Not authenticated');
      return workspaceApiClient.updateWorkspace(workspaceId, token, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  // Delete workspace mutation
  const deleteWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      if (!token) throw new Error('Not authenticated');
      return workspaceApiClient.deleteWorkspace(workspaceId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async ({ workspaceId, email }: { workspaceId: string; email: string }) => {
      if (!token) throw new Error('Not authenticated');
      return workspaceApiClient.inviteMember(workspaceId, email, token);
    },
  });

  // Actions
  const switchWorkspace = useCallback((workspaceId: string) => {
    const workspace = workspacesData?.workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, workspaceId);
      // Update the query cache with new active workspace
      queryClient.setQueryData(['workspaces', token], (old: any) => ({
        ...old,
        activeWorkspace: workspace,
      }));
      console.log('[WORKSPACE] Switched to workspace:', workspaceId);
    }
  }, [workspacesData?.workspaces, queryClient, token]);

  const createWorkspace = useCallback(async (name: string, icon?: string) => {
    try {
      const result = await createWorkspaceMutation.mutateAsync({ name, icon });
      return result.success
        ? { success: true, workspaceId: result.workspaceId }
        : { success: false, error: 'Failed to create workspace' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create workspace',
      };
    }
  }, [createWorkspaceMutation]);

  const refreshWorkspaces = useCallback(async () => {
    await refetchWorkspaces();
  }, [refetchWorkspaces]);

  const updateWorkspace = useCallback(async (workspaceId: string, updates: { name?: string; icon?: string }) => {
    try {
      const result = await updateWorkspaceMutation.mutateAsync({ workspaceId, updates });
      return result.success
        ? { success: true }
        : { success: false, error: 'Failed to update workspace' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update workspace',
      };
    }
  }, [updateWorkspaceMutation]);

  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    try {
      const result = await deleteWorkspaceMutation.mutateAsync(workspaceId);
      return result.success
        ? { success: true }
        : { success: false, error: 'Failed to delete workspace' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete workspace',
      };
    }
  }, [deleteWorkspaceMutation]);

  const inviteMember = useCallback(async (workspaceId: string, email: string) => {
    try {
      const result = await inviteMemberMutation.mutateAsync({ workspaceId, email });
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to invite member',
      };
    }
  }, [inviteMemberMutation]);

  const clearError = useCallback(() => {
    queryClient.resetQueries({ queryKey: ['workspaces'] });
  }, [queryClient]);

  const value: WorkspaceContextValue = {
    workspaces: workspacesData?.workspaces || [],
    activeWorkspace: workspacesData?.activeWorkspace || null,
    isLoading: authLoading || workspacesLoading,
    switchWorkspace,
    createWorkspace,
    refreshWorkspaces,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
    clearError,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
