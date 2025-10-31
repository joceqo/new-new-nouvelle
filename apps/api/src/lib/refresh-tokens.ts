import { randomBytes } from 'crypto';
import { RefreshTokenStore } from '../types';

// In-memory refresh token storage (replace with Redis/database in production)
const refreshTokenStore = new Map<string, RefreshTokenStore>();

/**
 * Generate a cryptographically secure refresh token
 */
export function generateRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Store a refresh token
 * @param userId - User ID
 * @param token - Refresh token
 * @param expiryDays - Number of days until expiration (default: 30)
 */
export function storeRefreshToken(
  userId: string,
  token: string,
  expiryDays: number = 30
): void {
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
  refreshTokenStore.set(token, {
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
  });
}

/**
 * Verify a refresh token and return the associated user ID
 * @param token - Refresh token to verify
 * @returns User ID if valid, null otherwise
 */
export function verifyRefreshToken(token: string): string | null {
  const stored = refreshTokenStore.get(token);

  if (!stored) {
    return null;
  }

  // Check if expired
  if (stored.expiresAt < new Date()) {
    refreshTokenStore.delete(token);
    return null;
  }

  return stored.userId;
}

/**
 * Revoke a refresh token (e.g., on logout)
 * @param token - Refresh token to revoke
 */
export function revokeRefreshToken(token: string): void {
  refreshTokenStore.delete(token);
}

/**
 * Revoke all refresh tokens for a user
 * @param userId - User ID
 */
export function revokeAllUserRefreshTokens(userId: string): void {
  for (const [token, stored] of refreshTokenStore.entries()) {
    if (stored.userId === userId) {
      refreshTokenStore.delete(token);
    }
  }
}

/**
 * Clear expired refresh tokens
 */
export function clearExpiredRefreshTokens(): void {
  const now = new Date();
  for (const [token, stored] of refreshTokenStore.entries()) {
    if (stored.expiresAt < now) {
      refreshTokenStore.delete(token);
    }
  }
}

// Clear expired refresh tokens every hour
setInterval(clearExpiredRefreshTokens, 60 * 60 * 1000);
