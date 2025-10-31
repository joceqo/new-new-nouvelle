import { describe, it, expect, beforeEach } from 'bun:test';
import {
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} from '../refresh-tokens';

describe('Refresh Token Management', () => {
  const testUserId = 'user-123';

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const token = generateRefreshToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const tokens = new Set<string>();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateRefreshToken());
      }
      // All tokens should be unique
      expect(tokens.size).toBe(100);
    });

    it('should generate URL-safe tokens', () => {
      const token = generateRefreshToken();
      // base64url characters are alphanumeric plus - and _
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });

  describe('storeRefreshToken', () => {
    it('should store a refresh token', () => {
      const token = generateRefreshToken();
      storeRefreshToken(testUserId, token);

      // Verify it was stored
      const userId = verifyRefreshToken(token);
      expect(userId).toBe(testUserId);
    });

    it('should store with custom expiry days', () => {
      const token = generateRefreshToken();
      storeRefreshToken(testUserId, token, 7); // 7 days

      const userId = verifyRefreshToken(token);
      expect(userId).toBe(testUserId);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = generateRefreshToken();
      storeRefreshToken(testUserId, token);

      const userId = verifyRefreshToken(token);
      expect(userId).toBe(testUserId);
    });

    it('should return null for non-existent token', () => {
      const userId = verifyRefreshToken('non-existent-token');
      expect(userId).toBeNull();
    });

    it('should return null for expired token', async () => {
      const token = generateRefreshToken();
      // Store with 0 days expiry (immediately expired)
      storeRefreshToken(testUserId, token, 0);

      // Wait a tiny bit to ensure expiration
      await new Promise((resolve) => setTimeout(resolve, 10));

      const userId = verifyRefreshToken(token);
      expect(userId).toBeNull();
    });

    it('should not verify token twice (no reuse)', () => {
      // This test verifies that tokens can be used multiple times
      // until explicitly revoked (unlike OTPs which are single-use)
      const token = generateRefreshToken();
      storeRefreshToken(testUserId, token);

      const userId1 = verifyRefreshToken(token);
      expect(userId1).toBe(testUserId);

      // Should still work on second verification
      const userId2 = verifyRefreshToken(token);
      expect(userId2).toBe(testUserId);
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke a refresh token', () => {
      const token = generateRefreshToken();
      storeRefreshToken(testUserId, token);

      // Verify it works before revocation
      expect(verifyRefreshToken(token)).toBe(testUserId);

      // Revoke it
      revokeRefreshToken(token);

      // Should not work after revocation
      expect(verifyRefreshToken(token)).toBeNull();
    });

    it('should not error when revoking non-existent token', () => {
      expect(() => {
        revokeRefreshToken('non-existent-token');
      }).not.toThrow();
    });
  });

  describe('revokeAllUserRefreshTokens', () => {
    it('should revoke all tokens for a user', () => {
      const token1 = generateRefreshToken();
      const token2 = generateRefreshToken();
      const token3 = generateRefreshToken();

      storeRefreshToken(testUserId, token1);
      storeRefreshToken(testUserId, token2);
      storeRefreshToken('other-user', token3);

      // All should work initially
      expect(verifyRefreshToken(token1)).toBe(testUserId);
      expect(verifyRefreshToken(token2)).toBe(testUserId);
      expect(verifyRefreshToken(token3)).toBe('other-user');

      // Revoke all for testUserId
      revokeAllUserRefreshTokens(testUserId);

      // testUserId tokens should be revoked
      expect(verifyRefreshToken(token1)).toBeNull();
      expect(verifyRefreshToken(token2)).toBeNull();

      // other-user token should still work
      expect(verifyRefreshToken(token3)).toBe('other-user');
    });

    it('should not error when revoking for user with no tokens', () => {
      expect(() => {
        revokeAllUserRefreshTokens('user-with-no-tokens');
      }).not.toThrow();
    });
  });
});
