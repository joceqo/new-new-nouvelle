import type {
  SendCodeResponse,
  VerifyCodeResponse,
  GetMeResponse,
  ListWorkspacesResponse,
  CreateWorkspaceResponse,
  WorkspaceDetailsResponse,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class AuthApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async sendCode(email: string): Promise<SendCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Handle rate limiting specifically
      if (response.status === 429) {
        return { 
          success: false, 
          error: 'Too many requests. Please wait a moment before trying again.' 
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, handle as text response
        const text = await response.text();
        console.error('Failed to parse JSON response:', text);
        return { 
          success: false, 
          error: response.ok ? 'Invalid response format' : `Server error: ${response.status}` 
        };
      }

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to send code' };
      }

      return data;
    } catch (error) {
      console.error('Send code error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async verifyCode(email: string, code: string): Promise<VerifyCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      // Handle rate limiting specifically
      if (response.status === 429) {
        return { 
          success: false, 
          error: 'Too many requests. Please wait a moment before trying again.' 
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, handle as text response
        const text = await response.text();
        console.error('Failed to parse JSON response:', text);
        return { 
          success: false, 
          error: response.ok ? 'Invalid response format' : `Server error: ${response.status}` 
        };
      }

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to verify code' };
      }

      return data;
    } catch (error) {
      console.error('Verify code error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async verifyMagicLink(token: string): Promise<VerifyCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/verify-magic-link?token=${encodeURIComponent(token)}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to verify magic link' };
      }

      return data;
    } catch (error) {
      console.error('Verify magic link error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async getMe(token: string): Promise<GetMeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Unauthorized' };
      }

      return data;
    } catch (error) {
      console.error('Get me error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async refreshToken(refreshToken: string): Promise<VerifyCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to refresh token' };
      }

      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async logout(refreshToken: string, accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to logout' };
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
}

export class WorkspaceApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async listWorkspaces(token: string): Promise<ListWorkspacesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to list workspaces' };
      }

      return data;
    } catch (error) {
      console.error('List workspaces error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async getWorkspace(workspaceId: string, token: string): Promise<WorkspaceDetailsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to get workspace' };
      }

      return data;
    } catch (error) {
      console.error('Get workspace error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async createWorkspace(
    name: string,
    token: string,
    icon?: string,
    slug?: string
  ): Promise<CreateWorkspaceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, icon, slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to create workspace' };
      }

      return data;
    } catch (error) {
      console.error('Create workspace error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async updateWorkspace(
    workspaceId: string,
    token: string,
    updates: { name?: string; icon?: string; slug?: string }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update workspace' };
      }

      return { success: true };
    } catch (error) {
      console.error('Update workspace error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async deleteWorkspace(
    workspaceId: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to delete workspace' };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete workspace error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async inviteMember(
    workspaceId: string,
    email: string,
    token: string
  ): Promise<{ success: boolean; inviteLink?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces/${workspaceId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to invite member' };
      }

      return data;
    } catch (error) {
      console.error('Invite member error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async acceptInvite(
    token: string,
    authToken: string
  ): Promise<{ success: boolean; workspaceId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/workspaces/invite/${token}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to accept invite' };
      }

      return data;
    } catch (error) {
      console.error('Accept invite error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
}

export const authApiClient = new AuthApiClient();
export const workspaceApiClient = new WorkspaceApiClient();
