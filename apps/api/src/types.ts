export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface OTPStore {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface RefreshTokenStore {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthContext {
  user?: User;
}
