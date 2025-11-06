import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { createAuthRoutes } from './routes/auth';
import { createWorkspaceRoutes } from './routes/workspaces';
import { logger } from './lib/logger';

// Validate critical environment variables at startup
function validateEnvVars() {
  const requiredVars = [
    'CONVEX_URL',
    'RESEND_API_KEY',
    'FRONTEND_URL',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set these variables in your .env file and restart the server.');
    process.exit(1);
  }
}

// Run validation before starting the server
validateEnvVars();

const PORT = process.env.PORT || 3001;
const LOG_HTTP_REQUESTS = process.env.LOG_HTTP_REQUESTS === 'true';

const app = new Elysia()
  .use(
    cors({
      origin: [
        'http://localhost:3000', // Web app
        'http://localhost:1420', // Desktop app Vite server
        'http://localhost:5173', // Vite dev server
        'http://localhost:5174', // Alternative Vite port
        'tauri://localhost', // Tauri
        'https://tauri.localhost', // Tauri alternative
      ],
      credentials: true,
    })
  )
  // Combined request middleware: HTTPS enforcement + HTTP logging
  .onRequest(({ request, set, store }) => {
    // Log incoming request if enabled
    if (LOG_HTTP_REQUESTS) {
      (store as any).requestStart = Date.now();
      logger.info(
        {
          method: request.method,
          url: request.url,
          headers: Object.fromEntries(request.headers.entries()),
        },
        `→ ${request.method} ${new URL(request.url).pathname}`
      );
    }

    // HTTPS enforcement in production
    if (process.env.NODE_ENV === 'production') {
      const proto = request.headers.get('x-forwarded-proto');
      if (proto !== 'https') {
        set.status = 403;
        return { error: 'HTTPS required' };
      }
    }
  })
  // Security headers + Response logging
  .onAfterHandle(({ request, set, store }) => {
    // Add security headers
    set.headers['X-Content-Type-Options'] = 'nosniff';
    set.headers['X-Frame-Options'] = 'DENY';
    set.headers['X-XSS-Protection'] = '1; mode=block';
    if (process.env.NODE_ENV === 'production') {
      set.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    }

    // Log response if enabled
    if (LOG_HTTP_REQUESTS) {
      const duration = Date.now() - ((store as any).requestStart || Date.now());
      const pathname = new URL(request.url).pathname;
      logger.info(
        {
          method: request.method,
          url: request.url,
          status: set.status,
          duration: `${duration}ms`,
        },
        `← ${request.method} ${pathname} ${set.status} (${duration}ms)`
      );
    }
  })
  .onStart(() => {
    logger.info(
      {
        port: PORT,
        urls: {
          base: `http://localhost:${PORT}`,
          health: `http://localhost:${PORT}/health`,
          auth: `http://localhost:${PORT}/auth`,
        },
      },
      '🚀 Nouvelle API Server running!'
    );
  })
  .get('/', () => ({
    message: 'Nouvelle API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      workspaces: '/workspaces',
    },
  }))
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .use(createAuthRoutes())
  .use(createWorkspaceRoutes())
  .onError(({ code, error, set }) => {
    logger.error({ code, err: error }, 'Request error');

    if (code === 'VALIDATION') {
      set.status = 400;
      return { error: 'Validation error', details: error.message };
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { error: 'Route not found' };
    }

    set.status = 500;
    return { error: 'Internal server error' };
  })
  .listen(PORT);
