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

export interface AuthContext {
  user?: User;
}
