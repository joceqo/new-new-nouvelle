import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { generateOTP, storeOTP, verifyOTP } from '../lib/otp';
import { sendOTPEmail } from '../lib/email';
import { findOrCreateUser, findUserById } from '../lib/users';

export function createAuthRoutes() {
  return new Elysia({ prefix: '/auth' })
    .use(
      jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
        exp: '7d', // Token expires in 7 days
      })
    )
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
        storeOTP(email, code);

        // Send OTP via email
        await sendOTPEmail(email, code);

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
        console.error('Send code error:', error);
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
        const isValid = verifyOTP(email, code);

        if (!isValid) {
          set.status = 401;
          return { error: 'Invalid or expired verification code' };
        }

        // Find or create user
        const user = findOrCreateUser(email);

        // Generate JWT token
        const token = await jwt.sign({
          userId: user.id,
          email: user.email,
        });

        // Log clickable URL in development
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev) {
          const port = process.env.PORT || 3001;
          console.log('\n=================================');
          console.log('✅ User authenticated:', user.email);
          console.log('🔗 Clickable test URL:');
          console.log(`   http://localhost:${port}/auth/me?token=${token}`);
          console.log('=================================\n');
        }

        return {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
          },
        };
      } catch (error) {
        console.error('Verify code error:', error);
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
      const isValid = verifyOTP(email, code);

      if (!isValid) {
        set.status = 401;
        return { error: 'Invalid or expired verification code' };
      }

      // Find or create user
      const user = findOrCreateUser(email);

      // Generate JWT token for authentication
      const authToken = await jwt.sign({
        userId: user.id,
        email: user.email,
      });

      return {
        success: true,
        token: authToken,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Magic link verification error:', error);
      set.status = 401;
      return { error: 'Invalid or expired link' };
    }
  })
  .get('/me', async ({ headers, query, set, jwt }) => {
    try {
      // Accept token from query string (for dev convenience) or Authorization header
      let token = query.token;

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

      const user = findUserById(payload.userId);

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
      console.error('Get user error:', error);
      set.status = 401;
      return { error: 'Unauthorized' };
    }
  });
}

export const authRoutes = createAuthRoutes();
