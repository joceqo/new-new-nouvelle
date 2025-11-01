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
