import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { createAuthRoutes } from './routes/auth';

const PORT = process.env.PORT || 3001;

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
  // HTTPS enforcement in production
  .onRequest(({ request, set }) => {
    if (process.env.NODE_ENV === 'production') {
      const proto = request.headers.get('x-forwarded-proto');
      if (proto !== 'https') {
        set.status = 403;
        return { error: 'HTTPS required' };
      }
    }
  })
  // Security headers
  .onAfterHandle(({ set }) => {
    set.headers['X-Content-Type-Options'] = 'nosniff';
    set.headers['X-Frame-Options'] = 'DENY';
    set.headers['X-XSS-Protection'] = '1; mode=block';
    if (process.env.NODE_ENV === 'production') {
      set.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    }
  })
  .onStart(() => {
    console.log(`
╔════════════════════════════════════════════╗
║  🚀 Nouvelle API Server running!          ║
╚════════════════════════════════════════════╝
📍 URL:    http://localhost:${PORT}
🔗 Health: http://localhost:${PORT}/health
🔐 Auth:   http://localhost:${PORT}/auth
`);
  })
  .get('/', () => ({
    message: 'Nouvelle API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
    },
  }))
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  }))
  .use(createAuthRoutes())
  .onError(({ code, error, set }) => {
    console.error('Error:', code, error);

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
