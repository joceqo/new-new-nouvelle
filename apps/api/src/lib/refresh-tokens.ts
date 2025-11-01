import { randomBytes } from 'crypto';
import { authLogger } from './logger';
import { convexClient, api } from './convex-client';

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

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
export async function storeRefreshToken(
  userId: string,
  token: string,
  expiryDays: number = 30
): Promise<void> {
  const expiresAt = Date.now() + expiryDays * 24 * 60 * 60 * 1000;
  await convexClient.mutation(api.refreshTokens.store, {
    userId,
    token,
    expiresAt,
  });
}

/**
 * Verify a refresh token and return the associated user ID
 * @param token - Refresh token to verify
 * @returns User ID if valid, null otherwise
 */
export async function verifyRefreshToken(token: string): Promise<string | null> {
  const stored = await convexClient.query(api.refreshTokens.getByToken, { token });

  if (!stored) {
    return null;
  }

  // Check if revoked
  if (stored.revoked) {
    return null;
  }

  // Check if expired
  if (stored.expiresAt < Date.now()) {
    await convexClient.mutation(api.refreshTokens.deleteToken, { token });
    return null;
  }

  return stored.userId;
}

/**
 * Revoke a refresh token (e.g., on logout)
 * @param token - Refresh token to revoke
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  await convexClient.mutation(api.refreshTokens.revoke, { token });
}

/**
 * Revoke all refresh tokens for a user
 * @param userId - User ID
 */
export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await convexClient.mutation(api.refreshTokens.revokeAllForUser, { userId });
}

/**
 * Clear expired refresh tokens
 */
export async function clearExpiredRefreshTokens(): Promise<void> {
  try {
    const count = await convexClient.mutation(api.refreshTokens.clearExpired, {});
    if (count > 0) {
      authLogger.info({ count }, 'Cleared expired refresh tokens');
    }
  } catch (error) {
    authLogger.error({ err: error }, 'Failed to clear expired refresh tokens');
  }
}

// Clear expired refresh tokens every hour
setInterval(clearExpiredRefreshTokens, CLEANUP_INTERVAL_MS);
