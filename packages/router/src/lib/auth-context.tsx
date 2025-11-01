import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from './types';
import { authApiClient } from './api-client';

interface AuthContextValue extends AuthState {
  login: (token: string, user: User, refreshToken?: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'nouvelle_auth_token';
const REFRESH_TOKEN_KEY = 'nouvelle_refresh_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const login = (token: string, user: User, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    // Call logout API to revoke refresh token
    if (refreshToken && token) {
      try {
        await authApiClient.logout(refreshToken, token);
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local logout even if API call fails
      }
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return false;
    }

    try {
      const response = await authApiClient.refreshToken(refreshToken);

      if (response.success && response.token && response.user) {
        localStorage.setItem(TOKEN_KEY, response.token);
        if (response.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        }
        setState(prev => ({
          ...prev,
          token: response.token!,
          user: response.user!,
        }));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await authApiClient.getMe(token);

      if (response.success && response.user) {
        setState({
          user: response.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Try to refresh the access token
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Try to refresh the access token before logging out
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        await logout();
      }
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up token refresh interval when authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }

    // Refresh every 50 minutes for 1-hour tokens
    const refreshInterval = setInterval(async () => {
      await refreshAccessToken();
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
