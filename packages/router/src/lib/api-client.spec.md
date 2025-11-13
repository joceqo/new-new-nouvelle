# Module: lib/api-client.ts

Status: stable
Intent: Type-safe HTTP API client with error handling, rate limit detection, and response parsing for authentication and workspace operations.

## Exports

```ts
export class AuthApiClient {
  constructor(baseUrl?: string);
  sendCode(email: string): Promise<SendCodeResponse>;
  verifyCode(email: string, code: string): Promise<VerifyCodeResponse>;
  verifyMagicLink(token: string): Promise<VerifyCodeResponse>;
  getMe(token: string): Promise<GetMeResponse>;
  refreshToken(refreshToken: string): Promise<VerifyCodeResponse>;
  logout(refreshToken: string, accessToken: string): Promise<{ success: boolean; error?: string }>;
}

export class WorkspaceApiClient {
  constructor(baseUrl?: string);
  listWorkspaces(token: string): Promise<ListWorkspacesResponse>;
  getWorkspace(workspaceId: string, token: string): Promise<WorkspaceDetailsResponse>;
  createWorkspace(name: string, token: string, icon?: string, slug?: string): Promise<CreateWorkspaceResponse>;
  updateWorkspace(workspaceId: string, token: string, updates: { name?: string; icon?: string; slug?: string }): Promise<{ success: boolean; error?: string }>;
  deleteWorkspace(workspaceId: string, token: string): Promise<{ success: boolean; error?: string }>;
  inviteMember(workspaceId: string, email: string, token: string): Promise<{ success: boolean; inviteLink?: string; error?: string }>;
  acceptInvite(token: string, authToken: string): Promise<{ success: boolean; workspaceId?: string; error?: string }>;
}

export const authApiClient: AuthApiClient;
export const workspaceApiClient: WorkspaceApiClient;
```

## Purpose & Behavior

### Core Functionality

- **Type-safe API calls**: All methods return typed response objects
- **Error handling**: Catches network errors and returns structured error responses
- **Rate limit detection**: Handles 429 status with user-friendly messages
- **JSON parsing safety**: Gracefully handles malformed JSON responses
- **Bearer token auth**: Standard Authorization header for authenticated requests
- **Singleton instances**: Pre-instantiated clients for convenient imports

## AuthApiClient

### Authentication Flow Methods

#### sendCode(email)

**Purpose**: Send verification code to email (passwordless auth step 1)

**Endpoint**: `POST /auth/send-code`

**Request**:
```json
{ "email": "user@example.com" }
```

**Response**: `SendCodeResponse`

**Error handling**:
- 429: Rate limit exceeded
- Network error: "Network error. Please try again."
- JSON parse error: "Invalid response format"

#### verifyCode(email, code)

**Purpose**: Verify email code and receive tokens (passwordless auth step 2)

**Endpoint**: `POST /auth/verify-code`

**Request**:
```json
{ "email": "user@example.com", "code": "123456" }
```

**Response**: `VerifyCodeResponse` (includes `token`, `refreshToken`, `user`)

#### verifyMagicLink(token)

**Purpose**: Authenticate via magic link token

**Endpoint**: `GET /auth/verify-magic-link?token={token}`

**Response**: `VerifyCodeResponse` (includes `token`, `refreshToken`, `user`)

**Use case**: Email magic link authentication

#### getMe(token)

**Purpose**: Validate token and fetch current user

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer {token}`

**Response**: `GetMeResponse` (includes `user`)

**Use case**: Auth state validation, session verification

#### refreshToken(refreshToken)

**Purpose**: Exchange refresh token for new access token

**Endpoint**: `POST /auth/refresh`

**Request**:
```json
{ "refreshToken": "..." }
```

**Response**: `VerifyCodeResponse` (includes new `token`, `refreshToken`, `user`)

**Use case**: Automatic token refresh before expiration

#### logout(refreshToken, accessToken)

**Purpose**: Revoke tokens on server

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer {accessToken}`

**Request**:
```json
{ "refreshToken": "..." }
```

**Response**: `{ success: boolean; error?: string }`

**Use case**: Clean logout with server-side token revocation

## WorkspaceApiClient

### Workspace Management Methods

#### listWorkspaces(token)

**Purpose**: Get all workspaces accessible to user

**Endpoint**: `GET /workspaces`

**Headers**: `Authorization: Bearer {token}`

**Response**: `ListWorkspacesResponse` (includes `workspaces[]`)

#### getWorkspace(workspaceId, token)

**Purpose**: Get detailed workspace information

**Endpoint**: `GET /workspaces/{workspaceId}`

**Response**: `WorkspaceDetailsResponse` (includes `workspace`)

#### createWorkspace(name, token, icon?, slug?)

**Purpose**: Create new workspace

**Endpoint**: `POST /workspaces`

**Request**:
```json
{ "name": "My Workspace", "icon": "🏢", "slug": "my-workspace" }
```

**Response**: `CreateWorkspaceResponse` (includes `workspaceId`)

#### updateWorkspace(workspaceId, token, updates)

**Purpose**: Update workspace properties

**Endpoint**: `PATCH /workspaces/{workspaceId}`

**Request**:
```json
{ "name": "New Name", "icon": "🎯", "slug": "new-slug" }
```

#### deleteWorkspace(workspaceId, token)

**Purpose**: Permanently delete workspace

**Endpoint**: `DELETE /workspaces/{workspaceId}`

**Warning**: Cascades to all workspace data

#### inviteMember(workspaceId, email, token)

**Purpose**: Generate invite link and send to email

**Endpoint**: `POST /workspaces/{workspaceId}/invite`

**Request**:
```json
{ "email": "colleague@example.com" }
```

**Response**: Includes optional `inviteLink` for manual sharing

#### acceptInvite(token, authToken)

**Purpose**: Accept workspace invitation

**Endpoint**: `POST /workspaces/invite/{token}/accept`

**Headers**: `Authorization: Bearer {authToken}`

**Response**: Includes `workspaceId` of joined workspace

## Configuration

### Base URL

```ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

**Environment variable**: `VITE_API_URL`

**Default**: `http://localhost:3001`

**Production**: Set via environment variable (e.g., `https://api.nouvelle.app`)

## Error Handling Strategy

### Consistent Response Pattern

All methods return objects with `success` boolean and optional `error` string:

```ts
{ success: false, error: "User-friendly error message" }
```

### Error Categories

1. **Rate limiting (429)**: Specific message about waiting
2. **Server errors (4xx, 5xx)**: Return `data.error` from API or generic message
3. **Network errors**: "Network error. Please try again."
4. **JSON parse errors**: "Invalid response format" or "Server error: {status}"

### Error Logging

All errors logged to console with method context:
```ts
console.error('Send code error:', error);
```

## Dependencies

- `./types` - All response type definitions
- `fetch` API - Native browser fetch (or polyfill)
- `import.meta.env` - Vite environment variables

## Usage Examples

### ⚠️ IMPORTANT: Do NOT use API clients directly in components

The API clients are **low-level primitives** used internally by context providers. Components should **always** use the context hooks which wrap these calls with React Query.

### ❌ WRONG - Direct API Client Usage

```ts
// DON'T DO THIS - Bypasses React Query!
import { authApiClient } from '@nouvelle/router';

function LoginForm() {
  const handleLogin = async () => {
    const result = await authApiClient.verifyCode(email, code);  // ❌ Bad
    // Missing: caching, loading states, error handling, optimistic updates
  };
}
```

### ✅ CORRECT - Use Context Providers

```ts
// DO THIS - Uses React Query through context
import { useAuth } from '@nouvelle/router';

function LoginForm() {
  const { login } = useAuth();

  const handleLogin = async () => {
    // Context handles React Query mutation internally
    const result = await authApiClient.verifyCode(email, code);
    if (result.success && result.token && result.user) {
      login(result.token, result.user, result.refreshToken);  // ✅ Good
    }
  };
}
```

### Internal Usage (Context Providers Only)

The API clients are used **inside** context providers with React Query:

```ts
// Inside auth-context.tsx
const logoutMutation = useMutation({
  mutationFn: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (refreshToken && token) {
      await authApiClient.logout(refreshToken, token);  // ✅ Wrapped by React Query
    }
  },
  onSuccess: () => {
    queryClient.clear();
  },
});
```

### Direct Usage (Testing/Debugging Only)

Direct API client usage is appropriate for:

- **Unit tests**: Testing API layer in isolation
- **Scripts**: Build scripts, data migrations, CLI tools
- **Debugging**: Console debugging API responses

```ts
// Testing
const mockClient = new AuthApiClient('http://localhost:3001');
const result = await mockClient.sendCode('test@example.com');

// Debugging
import { authApiClient } from '@nouvelle/router';
const debug = await authApiClient.getMe(token);
console.log('User:', debug.user);
```

## Testing Considerations

### Mockable Design

Clients are class-based with injected baseUrl for easy testing:

```ts
// Test setup
const mockClient = new AuthApiClient('http://mock-api.test');
```

### Error Scenario Testing

- Network failures (fetch throws)
- Rate limiting (429 responses)
- Invalid JSON (malformed responses)
- Auth failures (401 responses)
- Server errors (500 responses)

## Security Considerations

### Token Handling

- Access tokens sent via Authorization header (not URL params)
- Refresh tokens only in request body
- Tokens never logged to console

### HTTPS Enforcement

- Production API_URL should use `https://`
- Tokens should never be transmitted over HTTP in production

### Rate Limiting

- Client detects 429 responses
- User-friendly message encourages waiting
- Consider exponential backoff in future

## Performance Characteristics

- **No caching**: Raw API calls, caching handled by React Query layer
- **No request deduplication**: Multiple calls = multiple requests (React Query handles this)
- **JSON parsing**: Minimal overhead, handles errors gracefully
- **Promise-based**: All methods return Promises for async/await usage

## Future Improvements

- **Request interceptors**: Global request/response transformation
- **Retry logic**: Automatic retry with exponential backoff
- **Request cancellation**: AbortController support for cancelled requests
- **Request deduplication**: Prevent duplicate concurrent requests
- **Offline queue**: Queue requests when offline, send when reconnected
- **Request timeout**: Abort slow requests after timeout
- **Response caching**: Optional client-side HTTP cache
- **GraphQL support**: Alternative to REST endpoints

## Related Files

- Uses: `lib/types.ts` - All response type definitions
- Used by: `lib/auth-context.tsx` - authApiClient for auth operations
- Used by: `lib/workspace-context.tsx` - workspaceApiClient for workspace operations
- Used by: `lib/page-context.tsx` - Direct fetch calls (could be refactored to use client)

Last updated: 2025-11-12
