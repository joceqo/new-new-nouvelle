# Authentication Guide

This document explains how authentication works in Nouvelle and how to use it in your applications.

## Overview

Nouvelle uses a **passwordless email/OTP authentication system** with the following flow:

1. User enters their email address
2. System sends a 6-digit OTP code via email
3. User enters the OTP code
4. System verifies the code and issues a JWT token
5. User is authenticated for 7 days

## Architecture

### Backend (apps/api)
- Elysia server with authentication endpoints
- JWT token generation and validation
- OTP code generation and verification
- Email sending via Resend

### Shared Auth Package (packages/auth)
- `AuthProvider`: React context for authentication state
- `useAuth()`: Hook to access auth state and methods
- `LoginForm`: Complete login UI component
- `authApiClient`: API client for authentication

### Apps (apps/web, apps/desktop)
- Both apps use the same authentication flow
- Shared auth state via `AuthProvider`
- JWT token stored in localStorage
- Auto-restore session on app load

## Usage

### Accessing Authentication State

```tsx
import { useAuth } from '@nouvelle/auth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

To create a protected route, check authentication state:

```tsx
import { Route } from '@tanstack/react-router';
import { useAuth } from '@nouvelle/auth';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Protected Content</div>;
}
```

### Logging Out

```tsx
import { useAuth } from '@nouvelle/auth';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

### Making Authenticated API Calls

```tsx
import { useAuth } from '@nouvelle/auth';

function MyComponent() {
  const { token } = useAuth();

  const fetchData = async () => {
    const response = await fetch('http://localhost:3001/api/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  };

  // Use fetchData...
}
```

## Development

### Testing the Login Flow

1. Start the API server:
   ```bash
   pnpm dev:api
   ```

2. Start the web or desktop app:
   ```bash
   pnpm dev:web
   # or
   pnpm dev:desktop
   ```

3. Navigate to `/login`

4. Enter an email address and click "Continue"

5. Check the API server console for the OTP code:
   ```
   =================================
   📧 OTP Code for: user@example.com
   🔑 Code: 123456
   =================================
   ```

6. Enter the code and click "Verify"

### Running All Services

To run both API and web app together:

```bash
pnpm dev:all
```

## Configuration

### Environment Variables

Both web and desktop apps need the API URL configured:

**apps/web/.env**
```env
VITE_API_URL=http://localhost:3001
```

**apps/desktop/.env**
```env
VITE_API_URL=http://localhost:3001
```

### API Configuration

See `apps/api/README.md` for API configuration details.

## Security Considerations

1. **JWT Secret**: Use a strong secret in production
2. **Token Storage**: Tokens are stored in localStorage (consider using httpOnly cookies for web)
3. **Token Expiration**: Tokens expire after 7 days
4. **OTP Expiration**: OTP codes expire after 10 minutes
5. **Rate Limiting**: Consider adding rate limiting to prevent abuse
6. **HTTPS**: Always use HTTPS in production

## Production Setup

1. **Configure Resend**: Get an API key and verify your domain
2. **Set JWT Secret**: Use a secure random string
3. **Database**: Replace in-memory storage with a real database
4. **Redis**: Use Redis for OTP storage
5. **CORS**: Update CORS configuration for production domains
6. **Monitoring**: Add logging and error tracking

## Troubleshooting

### "Network error" when logging in

- Check that the API server is running (`pnpm dev:api`)
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors

### OTP code not received in development

- Check the API server console for the code
- In development, codes are logged instead of emailed

### "Invalid token" error

- Token may have expired (7 days)
- Try logging out and logging in again
- Check that JWT_SECRET is consistent

## API Routes

The router package includes these auth-related routes:

- `/login` - Login page with email/OTP form
- `/` - Home page (can be made protected)
- Other routes can be protected using the `useAuth()` hook

## Next Steps

- Add user profile management
- Implement role-based access control
- Add social login providers
- Add two-factor authentication
- Implement password-based auth as fallback
