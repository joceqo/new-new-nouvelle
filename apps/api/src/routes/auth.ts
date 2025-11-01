import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { rateLimit } from 'elysia-rate-limit';
import { generateOTP, storeOTP, verifyOTP } from '../lib/otp';
import { sendOTPEmail } from '../lib/email';
import { findOrCreateUser, findUserById } from '../lib/users';
import {
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} from '../lib/refresh-tokens';
import { trackSuccess, trackFailure } from '../lib/metrics';
import { authLogger } from '../lib/logger';

export function createAuthRoutes() {
  // Validate JWT_SECRET is set
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      'JWT_SECRET environment variable is required. Please set it in your .env file.'
    );
  }

  // Get token expiry from environment or use defaults
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || '1h'; // Shorter for better security
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '30d';

  const isTest = process.env.NODE_ENV === 'test';

  const app = new Elysia({ prefix: '/auth' })
    .use(
      jwt({
        name: 'jwt',
        secret: jwtSecret,
        exp: accessTokenExpiry, // Now configurable, default 1 hour
      })
    );

  // Apply rate limiting only in non-test environments
  if (!isTest) {
    app.use(
      rateLimit({
        duration: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 requests per 15 minutes
      })
    );
  }

  return app
  .post(
    '/send-code',
    async ({ body, set, jwt }) => {
      try {
        const { email } = body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          set.status = 400;
          return { error: 'Invalid email address' };
        }

        // Generate and store OTP
        const code = generateOTP();
        await storeOTP(email, code);

        // Track OTP generation
        trackSuccess('otp.generated', {
          email,
          metadata: { emailDomain: email.split('@')[1] },
        });

        // Send OTP via email
        try {
          await sendOTPEmail(email, code);
          trackSuccess('otp.sent', { email });
        } catch (emailError) {
          trackFailure('otp.sent', 'Email sending failed', { email });
          throw emailError;
        }

        // In development, also generate a magic link for convenience
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev) {
          // Generate a signed token containing the email and OTP code
          const magicToken = await jwt.sign({
            email,
            code,
          });

          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          const magicLink = `${frontendUrl}/auth/magic-link?token=${magicToken}`;

          console.log('\n=================================');
          console.log('🔗 Magic Link (Dev Only):');
          console.log(`   ${magicLink}`);
          console.log('=================================\n');
        }

        return { success: true, message: 'Verification code sent' };
      } catch (error) {
        authLogger.error({ err: error, email: body.email }, 'Send code error');
        set.status = 500;
        return { error: 'Failed to send verification code' };
      }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    }
  )
  .post(
    '/verify-code',
    async ({ body, set, jwt }) => {
      try {
        const { email, code } = body;

        // Verify OTP
        const isValid = await verifyOTP(email, code);

        if (!isValid) {
          trackFailure('otp.verification', 'Invalid or expired code', { email });
          set.status = 401;
          return { error: 'Invalid or expired verification code' };
        }

        trackSuccess('otp.verification', { email });

        // Find or create user
        const user = await findOrCreateUser(email);

        trackSuccess('auth.login', {
          userId: user.id,
          email: user.email,
          metadata: { method: 'otp' },
        });

        // Generate JWT access token
        const token = await jwt.sign({
          userId: user.id,
          email: user.email,
        });

        trackSuccess('token.generated', {
          userId: user.id,
          email: user.email,
          metadata: { tokenType: 'access', expiresIn: accessTokenExpiry },
        });

        // Generate refresh token
        const refreshToken = generateRefreshToken();
        const refreshExpiryDays = parseInt(refreshTokenExpiry.replace('d', ''), 10) || 30;
        await storeRefreshToken(user.id, refreshToken, refreshExpiryDays);

        trackSuccess('token.generated', {
          userId: user.id,
          email: user.email,
          metadata: { tokenType: 'refresh', expiresIn: refreshTokenExpiry },
        });

        // Log clickable URL in development
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev) {
          const port = process.env.PORT || 3001;
          console.log('\n=================================');
          console.log('✅ User authenticated:', user.email);
          console.log('🔗 Clickable test URL:');
          console.log(`   http://localhost:${port}/auth/me?token=${token}`);
          console.log('🔄 Refresh token:', refreshToken);
          console.log('=================================\n');
        }

        return {
          success: true,
          token,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
          },
        };
      } catch (error) {
        authLogger.error({ err: error, email: body.email }, 'Verify code error');
        set.status = 500;
        return { error: 'Failed to verify code' };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        code: t.String(),
      }),
    }
  )
  .post(
    '/refresh',
    async ({ body, set, jwt }) => {
      try {
        const { refreshToken } = body;

        // Verify refresh token
        const userId = await verifyRefreshToken(refreshToken);

        if (!userId) {
          trackFailure('token.refresh', 'Invalid or expired refresh token', {});
          set.status = 401;
          return { error: 'Invalid or expired refresh token' };
        }

        // Get user
        const user = await findUserById(userId);

        if (!user) {
          trackFailure('token.refresh', 'User not found', { userId });
          set.status = 401;
          return { error: 'User not found' };
        }

        trackSuccess('token.refresh', {
          userId: user.id,
          email: user.email,
          metadata: { tokenRotation: true },
        });

        // Generate new access token
        const newAccessToken = await jwt.sign({
          userId: user.id,
          email: user.email,
        });

        trackSuccess('token.generated', {
          userId: user.id,
          email: user.email,
          metadata: { tokenType: 'access', source: 'refresh', expiresIn: accessTokenExpiry },
        });

        // Optionally rotate refresh token (recommended for better security)
        const newRefreshToken = generateRefreshToken();
        const refreshExpiryDays = parseInt(refreshTokenExpiry.replace('d', ''), 10) || 30;

        // Revoke old refresh token and store new one
        await revokeRefreshToken(refreshToken);
        await storeRefreshToken(user.id, newRefreshToken, refreshExpiryDays);

        trackSuccess('token.generated', {
          userId: user.id,
          email: user.email,
          metadata: { tokenType: 'refresh', source: 'refresh', expiresIn: refreshTokenExpiry },
        });

        return {
          success: true,
          token: newAccessToken,
          refreshToken: newRefreshToken,
          user: {
            id: user.id,
            email: user.email,
          },
        };
      } catch (error) {
        authLogger.error({ err: error, refreshToken: body.refreshToken }, 'Refresh token error');
        set.status = 401;
        return { error: 'Failed to refresh token' };
      }
    },
    {
      body: t.Object({
        refreshToken: t.String(),
      }),
    }
  )
  .get('/verify-magic-link', async ({ query, set, jwt }) => {
    try {
      const { token } = query;

      if (!token) {
        set.status = 400;
        return { error: 'Missing token parameter' };
      }

      // Verify the signed token
      const payload = await jwt.verify(token);

      if (!payload || typeof payload.email !== 'string' || typeof payload.code !== 'string') {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const { email, code } = payload;

      // Verify OTP
      const isValid = await verifyOTP(email, code);

      if (!isValid) {
        set.status = 401;
        return { error: 'Invalid or expired verification code' };
      }

      // Find or create user
      const user = await findOrCreateUser(email);

      // Generate JWT token for authentication
      const authToken = await jwt.sign({
        userId: user.id,
        email: user.email,
      });

      // Generate refresh token
      const refreshToken = generateRefreshToken();
      const refreshExpiryDays = parseInt(refreshTokenExpiry.replace('d', ''), 10) || 30;
      await storeRefreshToken(user.id, refreshToken, refreshExpiryDays);

      return {
        success: true,
        token: authToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      authLogger.error({ err: error, token: query.token }, 'Magic link verification error');
      set.status = 401;
      return { error: 'Invalid or expired link' };
    }
  })
  .get('/me', async ({ headers, query, set, jwt }) => {
    try {
      // Accept token from query string in development only (for dev convenience)
      const isDev = process.env.NODE_ENV !== 'production';
      let token = isDev ? query.token : undefined;

      if (!token) {
        const authorization = headers['authorization'];
        if (!authorization || !authorization.startsWith('Bearer ')) {
          set.status = 401;
          return { error: 'Unauthorized' };
        }
        token = authorization.substring(7);
      }

      const payload = await jwt.verify(token);

      if (!payload || typeof payload.userId !== 'string') {
        set.status = 401;
        return { error: 'Invalid token' };
      }

      const user = await findUserById(payload.userId);

      if (!user) {
        set.status = 401;
        return { error: 'User not found' };
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      authLogger.error({ err: error }, 'Get user error');
      set.status = 401;
      return { error: 'Unauthorized' };
    }
  })
  .post(
    '/logout',
    async ({ body, set, headers }) => {
      try {
        const { refreshToken } = body;

        // Get user from access token to track logout
        const authHeader = headers.authorization;
        let userId: string | undefined;
        let email: string | undefined;

        if (authHeader) {
          try {
            const token = authHeader.replace('Bearer ', '');
            const payload = await (globalThis as any).jwt.verify(token);
            userId = payload.userId;
            email = payload.email;
          } catch {
            // Ignore token verification errors during logout
          }
        }

        // Revoke the refresh token
        await revokeRefreshToken(refreshToken);

        trackSuccess('auth.logout', {
          userId,
          email,
          metadata: { tokenRevoked: true },
        });

        return {
          success: true,
          message: 'Logged out successfully',
        };
      } catch (error) {
        authLogger.error({ err: error, refreshToken: body.refreshToken }, 'Logout error');
        set.status = 500;
        return { error: 'Failed to logout' };
      }
    },
    {
      body: t.Object({
        refreshToken: t.String(),
      }),
    }
  );
}
