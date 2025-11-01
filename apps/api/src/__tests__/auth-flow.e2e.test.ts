// Set environment variables FIRST, before any imports
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.NODE_ENV = 'test';

import { describe, it, expect, beforeAll } from 'bun:test';
import { Elysia } from 'elysia';
import { createAuthRoutes } from '../routes/auth';
import { generateOTP, storeOTP } from '../lib/otp';

describe('E2E Auth Flow', () => {
  let app: Elysia;
  const testEmail = 'e2e-test@example.com';
  let otpCode: string;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(() => {
    app = new Elysia().use(createAuthRoutes());
  });

  describe('Complete authentication flow with refresh tokens', () => {
    it('Step 1: should send OTP code to user email', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail }),
        })
      );

      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toBe('Verification code sent');
    });

    it('Step 2: should verify OTP and receive tokens', async () => {
      // Generate and store a valid OTP for testing
      otpCode = generateOTP();
      storeOTP(testEmail, otpCode);

      const response = await app.handle(
        new Request('http://localhost/auth/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail, code: otpCode }),
        })
      );

      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.token).toBeDefined();
      expect(json.refreshToken).toBeDefined();
      expect(json.user).toBeDefined();
      expect(json.user.email).toBe(testEmail);
      expect(json.user.id).toBeDefined();

      // Store tokens for subsequent tests
      accessToken = json.token;
      refreshToken = json.refreshToken;
      userId = json.user.id;
    });

    it('Step 3: should access protected route with valid access token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json.user).toBeDefined();
      expect(json.user.id).toBe(userId);
      expect(json.user.email).toBe(testEmail);
    });

    it('Step 4: should refresh access token using refresh token', async () => {
      // Store old refresh token BEFORE making the request
      const oldRefreshToken = refreshToken;

      const response = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
      );

      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.token).toBeDefined();
      expect(json.refreshToken).toBeDefined();
      expect(json.user.id).toBe(userId);

      // Verify we got a NEW refresh token (token rotation)
      expect(json.refreshToken).not.toBe(oldRefreshToken);

      // Update tokens for next tests
      accessToken = json.token;
      refreshToken = json.refreshToken;

      // Store old refresh token for next test
      (global as any).oldRefreshToken = oldRefreshToken;
    });

    it('Step 5: should reject old refresh token after rotation', async () => {
      const oldRefreshToken = (global as any).oldRefreshToken;

      // Verify we have an old refresh token to test with
      expect(oldRefreshToken).toBeDefined();
      expect(typeof oldRefreshToken).toBe('string');

      const response = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: oldRefreshToken }),
        })
      );

      // Should reject the revoked refresh token
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toMatch(/Invalid|expired|Failed/i);
    });

    it('Step 6: should access protected route with new access token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json.user.id).toBe(userId);
    });

    it('Step 7: should logout and revoke all tokens', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        })
      );

      const json = await response.json();
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it('Step 8: should reject revoked refresh token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
      );

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toMatch(/Invalid|expired|Failed/i);
    });
  });

  describe('Error handling and edge cases', () => {
    it('should reject invalid OTP code', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail, code: '000000' }),
        })
      );

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe('Invalid or expired verification code');
    });

    it('should reject invalid refresh token format', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: 'invalid-token' }),
        })
      );

      expect(response.status).toBe(401);
    });

    it('should reject access to protected route without token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/me', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('should reject access to protected route with invalid token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/me', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer invalid-token-here',
          },
        })
      );

      expect(response.status).toBe(401);
    });
  });

  describe('Multiple refresh token rotations', () => {
    it('should handle multiple consecutive token refreshes', async () => {
      // First, get a fresh set of tokens
      const code = generateOTP();
      storeOTP('rotation-test@example.com', code);

      let response = await app.handle(
        new Request('http://localhost/auth/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'rotation-test@example.com', code }),
        })
      );

      let json = await response.json();
      let currentRefreshToken = json.refreshToken;

      // Perform 3 consecutive refreshes
      for (let i = 0; i < 3; i++) {
        response = await app.handle(
          new Request('http://localhost/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: currentRefreshToken }),
          })
        );

        json = await response.json();
        expect(response.status).toBe(200);
        expect(json.refreshToken).toBeDefined();
        expect(json.refreshToken).not.toBe(currentRefreshToken);

        currentRefreshToken = json.refreshToken;
      }
    });
  });
});
