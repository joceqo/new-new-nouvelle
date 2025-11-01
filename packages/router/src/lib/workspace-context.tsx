import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { WorkspaceState } from './types';
import { workspaceApiClient } from './api-client';
import { useAuth } from './auth-context';

interface WorkspaceContextValue extends WorkspaceState {
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string, icon?: string) => Promise<string | null>;
  refreshWorkspaces: () => Promise<void>;
  updateWorkspace: (workspaceId: string, updates: { name?: string; icon?: string }) => Promise<boolean>;
  deleteWorkspace: (workspaceId: string) => Promise<boolean>;
  inviteMember: (workspaceId: string, email: string) => Promise<{ success: boolean; inviteLink?: string; error?: string }>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const ACTIVE_WORKSPACE_KEY = 'nouvelle_active_workspace_id';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [state, setState] = useState<WorkspaceState>({
    workspaces: [],
    activeWorkspace: null,
    isLoading: true,
  });

  // Load workspaces from API
  const loadWorkspaces = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setState({
        workspaces: [],
        activeWorkspace: null,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await workspaceApiClient.listWorkspaces(token);

      if (response.success && response.workspaces) {
        const workspaces = response.workspaces;

        // Get saved active workspace ID from localStorage
        const savedActiveId = localStorage.getItem(ACTIVE_WORKSPACE_KEY);

        // Try to find the saved active workspace, or use the first one
        let activeWorkspace = workspaces.find(w => w.id === savedActiveId) || workspaces[0] || null;

        setState({
          workspaces,
          activeWorkspace,
          isLoading: false,
        });

        // Save the active workspace ID
        if (activeWorkspace) {
          localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeWorkspace.id);
        }
      } else {
        setState({
          workspaces: [],
          activeWorkspace: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Load workspaces error:', error);
      setState({
        workspaces: [],
        activeWorkspace: null,
        isLoading: false,
      });
    }
  }, [token, isAuthenticated]);

  // Switch active workspace
  const switchWorkspace = useCallback((workspaceId: string) => {
    setState(prev => {
      const newActiveWorkspace = prev.workspaces.find(w => w.id === workspaceId) || null;

      if (newActiveWorkspace) {
        localStorage.setItem(ACTIVE_WORKSPACE_KEY, newActiveWorkspace.id);
      }

      return {
        ...prev,
        activeWorkspace: newActiveWorkspace,
      };
    });
  }, []);

  // Create new workspace
  const createWorkspace = useCallback(async (name: string, icon?: string): Promise<string | null> => {
    if (!token) return null;

    try {
      const response = await workspaceApiClient.createWorkspace(name, token, icon);

      if (response.success && response.workspaceId) {
        // Reload workspaces to get the new one
        await loadWorkspaces();
        return response.workspaceId;
      }

      return null;
    } catch (error) {
      console.error('Create workspace error:', error);
      return null;
    }
  }, [token, loadWorkspaces]);

  // Refresh workspaces
  const refreshWorkspaces = useCallback(async () => {
    await loadWorkspaces();
  }, [loadWorkspaces]);

  // Update workspace
  const updateWorkspace = useCallback(async (
    workspaceId: string,
    updates: { name?: string; icon?: string }
  ): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await workspaceApiClient.updateWorkspace(workspaceId, token, updates);

      if (response.success) {
        // Update local state
        setState(prev => ({
          ...prev,
          workspaces: prev.workspaces.map(w =>
            w.id === workspaceId ? { ...w, ...updates } : w
          ),
          activeWorkspace: prev.activeWorkspace?.id === workspaceId
            ? { ...prev.activeWorkspace, ...updates }
            : prev.activeWorkspace,
        }));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Update workspace error:', error);
      return false;
    }
  }, [token]);

  // Delete workspace
  const deleteWorkspace = useCallback(async (workspaceId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await workspaceApiClient.deleteWorkspace(workspaceId, token);

      if (response.success) {
        setState(prev => {
          const newWorkspaces = prev.workspaces.filter(w => w.id !== workspaceId);
          const wasActive = prev.activeWorkspace?.id === workspaceId;

          return {
            ...prev,
            workspaces: newWorkspaces,
            activeWorkspace: wasActive ? (newWorkspaces[0] || null) : prev.activeWorkspace,
          };
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Delete workspace error:', error);
      return false;
    }
  }, [token]);

  // Invite member
  const inviteMember = useCallback(async (
    workspaceId: string,
    email: string
  ): Promise<{ success: boolean; inviteLink?: string; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      return await workspaceApiClient.inviteMember(workspaceId, email, token);
    } catch (error) {
      console.error('Invite member error:', error);
      return { success: false, error: 'Failed to invite member' };
    }
  }, [token]);

  // Load workspaces when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      loadWorkspaces();
    } else {
      setState({
        workspaces: [],
        activeWorkspace: null,
        isLoading: false,
      });
      localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
    }
  }, [isAuthenticated, token, loadWorkspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        ...state,
        switchWorkspace,
        createWorkspace,
        refreshWorkspaces,
        updateWorkspace,
        deleteWorkspace,
        inviteMember,
      }}
    >
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
