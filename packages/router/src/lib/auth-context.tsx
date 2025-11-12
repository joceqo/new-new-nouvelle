import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const [currentToken, setCurrentToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  // Helper function to refresh token with retry logic
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
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
        setCurrentToken(response.token);
        // Update the query cache with new user data
        queryClient.setQueryData(['auth', 'me', response.token], {
          user: response.user,
          token: response.token,
        });
        return true;
      }

      console.log('❌ [REFRESH] Token refresh failed:', response.error || 'Unknown error');
      return false;
    } catch (error) {
      console.error('❌ [REFRESH] Token refresh error:', error);
      return false;
    }
  }, [queryClient]);

  // Query for user authentication state
  const {
    data: authData,
    isLoading: authLoading,
    refetch: refetchAuth,
  } = useQuery({
    queryKey: ['auth', 'me', currentToken],
    queryFn: async () => {
      if (!currentToken) {
        console.log('❌ [AUTH] No access token, returning unauthenticated state');
        return { user: null, token: null };
      }

      console.log('📞 [AUTH] Calling /auth/me with access token...');
      try {
        const response = await authApiClient.getMe(currentToken);

        if (response.success && response.user) {
          console.log('✅ [AUTH] Access token is valid, user authenticated:', {
            userId: response.user.id,
            email: response.user.email,
          });
          return { user: response.user, token: currentToken };
        }

        // Token invalid, try to refresh
        console.log('⚠️ [AUTH] Access token invalid/expired, attempting refresh...');
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          // After refresh, get the new token and fetch user again
          const newToken = localStorage.getItem(TOKEN_KEY);
          if (newToken) {
            const newResponse = await authApiClient.getMe(newToken);
            if (newResponse.success && newResponse.user) {
              console.log('✅ [AUTH] Token refreshed successfully, user authenticated');
              return { user: newResponse.user, token: newToken };
            }
          }
        }

        console.log('❌ [AUTH] Token refresh failed, returning unauthenticated state');
        // Clear tokens if refresh failed
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setCurrentToken(null);
        return { user: null, token: null };
      } catch (error) {
        console.error('❌ [AUTH] Auth check error:', error);

        // Try to refresh on error
        console.log('🔄 [AUTH] Attempting token refresh after error...');
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          const newToken = localStorage.getItem(TOKEN_KEY);
          if (newToken) {
            try {
              const newResponse = await authApiClient.getMe(newToken);
              if (newResponse.success && newResponse.user) {
                console.log('✅ [AUTH] Token refreshed successfully after error');
                return { user: newResponse.user, token: newToken };
              }
            } catch (retryError) {
              console.error('❌ [AUTH] Retry after refresh failed:', retryError);
            }
          }
        }

        console.log('❌ [AUTH] All auth attempts failed, returning unauthenticated state');
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setCurrentToken(null);
        return { user: null, token: null };
      }
    },
    enabled: true, // Always enabled, handles no-token case internally
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry, we handle refresh internally
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log('🚪 [LOGOUT] User logging out...');
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const token = localStorage.getItem(TOKEN_KEY);

      if (refreshToken && token) {
        try {
          console.log('📞 [LOGOUT] Calling logout API to revoke tokens...');
          await authApiClient.logout(refreshToken, token);
          console.log('✅ [LOGOUT] Tokens revoked on server');
        } catch (error) {
          console.error('❌ [LOGOUT] Logout API error:', error);
        }
      }

      console.log('🧹 [LOGOUT] Clearing local tokens...');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setCurrentToken(null);
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
      console.log('✅ [LOGOUT] Logout complete');
    },
  });

  // Login function (not a mutation since it's setting initial state)
  const login = useCallback((token: string, user: User, refreshToken?: string) => {
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

    setCurrentToken(token);

    // Set query data immediately for instant UI update
    queryClient.setQueryData(['auth', 'me', token], {
      user,
      token,
    });

    console.log('✅ [LOGIN] Login complete, user authenticated');
  }, [queryClient]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const checkAuth = useCallback(async () => {
    console.log('🔍 [AUTH] Checking authentication...');
    await refetchAuth();
  }, [refetchAuth]);

  // Set up token refresh interval when authenticated
  useEffect(() => {
    const isAuthenticated = !!authData?.user && !!authData?.token;

    if (!isAuthenticated) {
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
  }, [authData?.user, authData?.token, refreshAccessToken]);

  const value: AuthContextValue = {
    user: authData?.user || null,
    token: authData?.token || null,
    isAuthenticated: !!authData?.user && !!authData?.token,
    isLoading: authLoading,
    login,
    logout,
    checkAuth,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
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
