# Module: lib/auth-context.tsx

Status: stable
Intent: Authentication state management with automatic token refresh, localStorage persistence, and React Query integration.

## Exports

```ts
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function useAuth(): AuthContextValue;

interface AuthContextValue extends AuthState {
  login: (token: string, user: User, refreshToken?: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}
```

## Purpose & Behavior

### Core Functionality

- **State management**: Provides authentication state via React Context
- **Token persistence**: Stores tokens in localStorage for session continuity
- **Automatic refresh**: Refreshes access tokens before expiration (every 50 minutes for 1-hour tokens)
- **React Query integration**: Uses `useQuery` for auth state, `useMutation` for logout
- **Cross-component sync**: All components share single authentication state

### Authentication Flow

1. **Initial load**: Check localStorage for existing token → validate via `/auth/me`
2. **Token invalid**: Automatically attempt refresh using refresh token
3. **Refresh success**: Update tokens and continue authenticated session
4. **Refresh failure**: Clear tokens and redirect to login
5. **Active session**: Automatically refresh token every 50 minutes

## Component Contract

### AuthProvider

```tsx
<AuthProvider>
  {/* Your app components */}
</AuthProvider>
```

**Props**: `children` - React components to wrap with auth context

**Behavior**:
- Initializes auth state from localStorage on mount
- Sets up automatic token refresh interval when authenticated
- Provides auth context to all child components

### useAuth Hook

```ts
const { user, token, isAuthenticated, isLoading, login, logout, checkAuth, refreshAccessToken } = useAuth();
```

**Returns**: `AuthContextValue` object with state and methods

**Throws**: Error if used outside `AuthProvider`

## State Management

### Storage Keys

- `nouvelle_auth_token` - Access token (1 hour expiration)
- `nouvelle_refresh_token` - Refresh token (longer expiration)

### React Query Configuration

```ts
{
  queryKey: ['auth', 'me', currentToken],
  enabled: true,
  staleTime: 5 * 60 * 1000,     // 5 minutes
  gcTime: 10 * 60 * 1000,       // 10 minutes
  retry: false,                  // Custom refresh logic instead
}
```

## Methods

### login(token, user, refreshToken?)

**Purpose**: Set authenticated state after successful login

**Parameters**:
- `token` - Access token from auth API
- `user` - User object from auth API
- `refreshToken` - Optional refresh token

**Side effects**:
- Saves tokens to localStorage
- Updates React Query cache
- Triggers re-render with authenticated state

### logout()

**Purpose**: Clear authentication and revoke tokens

**Flow**:
1. Call backend `/auth/logout` to revoke tokens
2. Clear localStorage tokens
3. Clear React Query cache
4. Update state to unauthenticated

### checkAuth()

**Purpose**: Manual auth state revalidation

**Use case**: After external auth changes (e.g., password reset)

### refreshAccessToken()

**Purpose**: Exchange refresh token for new access token

**Returns**: `Promise<boolean>` - true if refresh succeeded

**Flow**:
1. Get refresh token from localStorage
2. Call `/auth/refresh` endpoint
3. If success: Save new tokens, update cache, return true
4. If failure: Return false (caller handles cleanup)

## Error Handling

### Token Refresh Failures

- Logs detailed error messages with emoji prefixes for debugging
- Gracefully falls back to unauthenticated state
- Clears invalid tokens to prevent retry loops

### Network Errors

- Catches and logs all network errors
- Attempts token refresh before giving up
- Returns user to login screen if all attempts fail

## Dependencies

- `react` - Context, hooks, component model
- `@tanstack/react-query` - Query and mutation management
- `./types` - User, AuthState type definitions
- `./api-client` - authApiClient for API calls

## Usage Examples

### App Setup

```tsx
import { AuthProvider } from '@nouvelle/router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

### Protected Component

```tsx
import { useAuth } from '@nouvelle/router';

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <div>Welcome, {user!.email}</div>;
}
```

### Login Flow

```tsx
import { useAuth } from '@nouvelle/router';

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (email: string) => {
    const response = await authApiClient.verifyCode(email, code);
    if (response.success && response.token && response.user) {
      login(response.token, response.user, response.refreshToken);
      navigate('/');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### Manual Auth Check

```tsx
const { checkAuth } = useAuth();

// After critical action that might invalidate auth
await criticalAction();
await checkAuth();
```

## Performance Characteristics

- **Initial load**: Single `/auth/me` request if token exists
- **Stale time**: 5 minutes before revalidation
- **Refresh interval**: 50 minutes (for 1-hour tokens)
- **Memory**: Minimal - single query cache entry
- **Re-renders**: Only when auth state actually changes

## Security Considerations

### Token Storage

- localStorage used for cross-tab persistence
- Consider httpOnly cookies for enhanced security in future
- Tokens cleared immediately on logout or auth failure

### Automatic Refresh

- Refresh interval configured for token expiration
- Falls back to login if refresh fails
- Prevents expired token usage

### HTTPS Only

- Tokens should only be transmitted over HTTPS
- Verify API_URL uses https:// in production

## Debugging

The module includes extensive logging with emoji prefixes:

- 🚀 LOGIN - Login events
- 🚪 LOGOUT - Logout events
- 📞 AUTH - Auth API calls
- 🔄 REFRESH - Token refresh attempts
- ✅ Success events
- ❌ Failure events
- ⏰ Scheduled events

## Future Improvements

- **Biometric authentication**: Face ID / Touch ID support
- **Session management**: View and revoke active sessions
- **Token rotation**: Automatic token rotation on critical actions
- **MFA support**: Multi-factor authentication integration
- **Offline mode**: Cached auth state for offline-first apps
- **httpOnly cookies**: Move from localStorage to cookies
- **Token claims**: Decode and expose JWT claims to consumers

## Edge Cases

- **Expired refresh token**: Falls back to login, no error thrown
- **Network offline**: Existing auth state preserved until network returns
- **Cross-tab logout**: Storage events sync logout across tabs
- **Token size limits**: Consider token size for localStorage limits
- **Concurrent requests**: React Query deduplicates concurrent auth checks

## Related Files

- Uses: `lib/types.ts` - User, AuthState types
- Uses: `lib/api-client.ts` - authApiClient
- Used by: `workspace-context.tsx`, `page-context.tsx` - Depends on auth state
- Used by: All protected routes and components

Last updated: 2025-11-12
