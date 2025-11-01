import type {
  SendCodeResponse,
  VerifyCodeResponse,
  GetMeResponse,
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

      const data = await response.json();

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

      const data = await response.json();

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

export const authApiClient = new AuthApiClient();
