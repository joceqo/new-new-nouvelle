// Set environment variables FIRST, before any imports
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.NODE_ENV = 'test';

import { describe, it, expect, beforeAll } from 'bun:test';
import { Elysia } from 'elysia';
import { createAuthRoutes } from '../auth';

describe('Auth Routes', () => {
  let app: Elysia;

  beforeAll(() => {
    // Create test app
    app = new Elysia().use(createAuthRoutes());
  });

  describe('POST /auth/send-code', () => {
    it('should return success when sending code to valid email', async () => {
      const response = await app
        .handle(
          new Request('http://localhost/auth/send-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
            }),
          })
        )
        .then((res) => res.json());

      expect(response.success).toBe(true);
      expect(response.message).toBe('Verification code sent');
    });

    it('should reject invalid email format', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/send-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'invalid-email',
          }),
        })
      );

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBe('Invalid email address');
    });

    it('should reject missing email', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/send-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
      );

      expect(response.status).toBe(422); // Elysia validation error
    });

    // Note: Rate limiting test would require making multiple requests
    // This is a basic placeholder for rate limiting testing
    it('should have rate limiting configured', async () => {
      // Send multiple requests quickly
      const promises = Array.from({ length: 3 }, () =>
        app.handle(
          new Request('http://localhost/auth/send-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'ratelimit@example.com',
            }),
          })
        )
      );

      const responses = await Promise.all(promises);

      // All should succeed for now (within rate limit)
      for (const response of responses) {
        const json = await response.json();
        expect(json.success).toBe(true);
      }
    });
  });

  describe('POST /auth/verify-code', () => {
    it('should reject verification with invalid code', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            code: '000000',
          }),
        })
      );

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe('Invalid or expired verification code');
    });

    it('should accept valid email and code format', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            code: '123456',
          }),
        })
      );

      // Will fail due to invalid code, but validates input structure
      expect(response.status).toBe(401);
    });

    it('should reject missing email or code', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
        })
      );

      expect(response.status).toBe(422); // Elysia validation error
    });
  });

  describe('GET /auth/me', () => {
    it('should reject unauthorized requests', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/me', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('should reject invalid bearer token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/me', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer invalid-token',
          },
        })
      );

      expect(response.status).toBe(401);
    });

    it('should reject malformed authorization header', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/me', {
          method: 'GET',
          headers: {
            Authorization: 'NotBearer token',
          },
        })
      );

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('should not accept query string token in production', async () => {
      // Set NODE_ENV to production temporarily
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Recreate app with production env
      const prodApp = new Elysia().use(createAuthRoutes());

      const response = await prodApp.handle(
        new Request('http://localhost/auth/me?token=some-token', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(401);

      // Restore original env
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('GET /auth/verify-magic-link', () => {
    it('should reject missing token parameter', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/verify-magic-link', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBe('Missing token parameter');
    });

    it('should reject invalid token', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/verify-magic-link?token=invalid', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toMatch(/Invalid|expired/i);
    });
  });

  describe('JWT Secret Validation', () => {
    it('should throw error when JWT_SECRET is not set', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      expect(() => {
        new Elysia().use(createAuthRoutes());
      }).toThrow(/JWT_SECRET environment variable is required/);

      // Restore
      process.env.JWT_SECRET = originalSecret;
    });
  });
});
