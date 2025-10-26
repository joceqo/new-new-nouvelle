import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from './types';
import { authApiClient } from './api-client';

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'nouvelle_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const login = (token: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
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
        logout();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
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
