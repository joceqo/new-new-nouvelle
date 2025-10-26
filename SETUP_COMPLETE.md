# Setup Complete!

## What Was Created

### 1. Backend API (apps/api)
- **Elysia server** with email/OTP authentication
- **Endpoints**:
  - `POST /auth/send-code` - Send OTP to email
  - `POST /auth/verify-code` - Verify OTP and get JWT
  - `GET /auth/me` - Get authenticated user
- **JWT authentication** (7-day tokens)
- **Resend integration** for email delivery
- **Development mode**: OTP codes logged to console

### 2. Auth Package (packages/auth)
- `AuthProvider` - React context for auth state
- `useAuth()` - Hook for accessing auth
- `LoginForm` & `LoginPage` - Complete login UI
- `authApiClient` - API client with type-safe methods
- **Shared by both web and desktop apps**

### 3. UI Components (packages/ui)
Added shadcn/ui components:
- Button
- Input
- Label
- Card
- Alert
- InputOTP

### 4. Router Updates (packages/router)
- Added `/login` route
- Integrated with auth package
- Ready for protected routes

### 5. App Configuration
Both **apps/web** and **apps/desktop** configured with:
- `AuthProvider` wrapper
- Environment variables for API URL
- Shared authentication flow

## Getting Started

### 1. Configure Environment

#### API Server (apps/api/.env)
```bash
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
```

**For Development**: You can leave RESEND_API_KEY empty. OTP codes will log to the console.

### 2. Start the Services

#### Option 1: Run Everything
```bash
pnpm dev:all
```
This starts API (port 3001) and web app (port 5173)

#### Option 2: Run Individually
```bash
# Terminal 1 - API
pnpm dev:api

# Terminal 2 - Web App
pnpm dev:web

# Or Desktop App
pnpm dev:desktop
```

### 3. Test the Login Flow

1. Navigate to `http://localhost:5173/login`
2. Enter an email address
3. Click "Continue with Email"
4. Check the API server console for the OTP code:
   ```
   =================================
   📧 OTP Code for: user@example.com
   🔑 Code: 123456
   =================================
   ```
5. Enter the 6-digit code
6. You're logged in!

## Using Authentication in Your Components

### Check Auth State
```tsx
import { useAuth } from '@nouvelle/auth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```tsx
import { useAuth } from '@nouvelle/auth';
import { useNavigate } from '@tanstack/react-router';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) return <div>Loading...</div>;

  return <div>Protected Content</div>;
}
```

### Making Authenticated API Calls
```tsx
const { token } = useAuth();

const response = await fetch('http://localhost:3001/your-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Available Scripts

```bash
# Development
pnpm dev          # Run all apps
pnpm dev:web      # Web app only
pnpm dev:desktop  # Desktop app only
pnpm dev:api      # API server only
pnpm dev:all      # API + Web

# Building
pnpm build        # Build everything
pnpm build:web    # Build web app
pnpm build:desktop # Build desktop app
pnpm build:api    # Build API server

# Type Checking
pnpm typecheck    # Check all packages
```

## Project Structure

```
nouvelle/
├── apps/
│   ├── api/              # Elysia backend server
│   ├── web/              # Vite web app
│   └── desktop/          # Tauri desktop app
├── packages/
│   ├── auth/             # Authentication package
│   ├── router/           # TanStack Router setup
│   ├── ui/               # Shared UI components
│   └── editor/           # Editor package
└── Documentation:
    ├── AUTHENTICATION.md      # Auth usage guide
    └── apps/api/README.md     # API documentation
```

## Next Steps

### For Development
1. **Add more routes**: Edit `packages/router/src/route-tree.tsx`
2. **Create protected routes**: Use the `useAuth()` hook
3. **Customize login UI**: Edit `packages/auth/src/components/LoginForm.tsx`
4. **Add user profile**: Create new API endpoints and UI

### For Production
1. **Get Resend API key**: Sign up at [resend.com](https://resend.com)
2. **Set strong JWT_SECRET**: Use a secure random string
3. **Add database**: Replace in-memory storage with PostgreSQL/MongoDB
4. **Add Redis**: Use Redis for OTP storage
5. **Configure CORS**: Update allowed origins in `apps/api/src/index.ts`
6. **Add rate limiting**: Prevent brute-force attacks
7. **Enable HTTPS**: Use SSL certificates

### Enhancements
- Add social login (Google, GitHub)
- Implement two-factor authentication
- Add user profile management
- Add role-based access control
- Add password-based auth as fallback
- Add refresh tokens
- Add email verification

## Known Issues

There are some pre-existing TypeScript errors in:
- **UI package**: Storybook type issues (non-blocking)
- **Desktop package**: tsconfig reference issues (non-blocking)

These don't affect the authentication system or runtime behavior.

## Troubleshooting

### "Network error" when logging in
- Ensure API server is running: `pnpm dev:api`
- Check `VITE_API_URL` in `.env` files
- Check browser console for CORS errors

### OTP code not received
- In development, check the API server console (not emailed)
- In production, verify Resend API key and domain

### "Invalid token" error
- Token may have expired (7 days)
- Try logging out and logging in again
- Ensure JWT_SECRET is consistent

## Need Help?

- **Authentication Guide**: See `AUTHENTICATION.md`
- **API Documentation**: See `apps/api/README.md`
- **Issues**: Check the console logs and error messages

## Success!

Your authentication system is ready to use! Start the servers with `pnpm dev:all` and navigate to `/login` to test it out.
