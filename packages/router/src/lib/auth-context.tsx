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
    console.log('🚀 [LOGIN] User logging in:', {
      userId: user.id,
      email: user.email,
      hasRefreshToken: !!refreshToken,
    });
    localStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      console.log('💾 [LOGIN] Stored refresh token in localStorage');
    } else {
      console.log('⚠️ [LOGIN] No refresh token provided');
    }
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
    console.log('✅ [LOGIN] Login complete, user authenticated');
  };

  const logout = async () => {
    console.log('🚪 [LOGOUT] User logging out...');
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    // Call logout API to revoke refresh token
    if (refreshToken && token) {
      try {
        console.log('📞 [LOGOUT] Calling logout API to revoke tokens...');
        await authApiClient.logout(refreshToken, token);
        console.log('✅ [LOGOUT] Tokens revoked on server');
      } catch (error) {
        console.error('❌ [LOGOUT] Logout API error:', error);
        // Continue with local logout even if API call fails
      }
    }

    console.log('🧹 [LOGOUT] Clearing local tokens...');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    console.log('✅ [LOGOUT] Logout complete');
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    console.log('🔄 [REFRESH] Starting token refresh...');
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      console.log('❌ [REFRESH] No refresh token found in localStorage');
      return false;
    }

    console.log('📞 [REFRESH] Calling /auth/refresh endpoint...');
    try {
      const response = await authApiClient.refreshToken(refreshToken);

      if (response.success && response.token && response.user) {
        console.log('✅ [REFRESH] Token refresh successful:', {
          userId: response.user.id,
          email: response.user.email,
          newAccessToken: response.token.substring(0, 20) + '...',
          newRefreshToken: response.refreshToken ? 'provided' : 'not provided',
        });
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

      console.log('❌ [REFRESH] Token refresh failed:', response.error || 'Unknown error');
      return false;
    } catch (error) {
      console.error('❌ [REFRESH] Token refresh error:', error);
      return false;
    }
  };

  const checkAuth = async () => {
    console.log('🔍 [AUTH] Checking authentication...');
    const token = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    console.log('🔑 [AUTH] Token check:', {
      hasAccessToken: !!token,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: token?.length,
      refreshTokenLength: refreshToken?.length,
    });

    if (!token) {
      console.log('❌ [AUTH] No access token found, logging out');
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      console.log('📞 [AUTH] Calling /auth/me with access token...');
      const response = await authApiClient.getMe(token);

      if (response.success && response.user) {
        console.log('✅ [AUTH] Access token is valid, user authenticated:', {
          userId: response.user.id,
          email: response.user.email,
        });
        setState({
          user: response.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('⚠️ [AUTH] Access token invalid/expired, attempting refresh...');
        // Try to refresh the access token
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          console.log('❌ [AUTH] Token refresh failed, logging out');
          await logout();
        } else {
          console.log('✅ [AUTH] Token refreshed successfully, user authenticated');
          // Successfully refreshed - update auth state
          setState(prev => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false,
          }));
        }
      }
    } catch (error) {
      console.error('❌ [AUTH] Auth check error:', error);
      console.log('🔄 [AUTH] Attempting token refresh after error...');
      // Try to refresh the access token before logging out
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        console.log('❌ [AUTH] Token refresh failed, logging out');
        await logout();
      } else {
        console.log('✅ [AUTH] Token refreshed successfully after error, user authenticated');
        // Successfully refreshed - update auth state
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
        }));
      }
    }
  };

  // Check auth on mount
  useEffect(() => {
    console.log('🎬 [AUTH] App started, initializing authentication...');
    checkAuth();
  }, []);

  // Set up token refresh interval when authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }

    console.log('⏰ [AUTH] Setting up automatic token refresh (every 50 minutes)');
    // Refresh every 50 minutes for 1-hour tokens
    const refreshInterval = setInterval(async () => {
      console.log('⏰ [AUTH] Automatic token refresh triggered');
      await refreshAccessToken();
    }, 50 * 60 * 1000);

    return () => {
      console.log('⏰ [AUTH] Clearing token refresh interval');
      clearInterval(refreshInterval);
    };
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
