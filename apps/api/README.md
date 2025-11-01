# Nouvelle API

Backend API server for Nouvelle built with Elysia.

## Features

- **Email/OTP Authentication**: Passwordless authentication with 6-digit OTP codes
- **JWT Tokens**: Secure authentication with JWT (7-day expiration)
- **Email Sending**: Integration with Resend for email delivery
- **CORS**: Configured for web and desktop apps

## Getting Started

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
```

**Important**:
- Generate a secure `JWT_SECRET` for production
- Get a Resend API key from [resend.com](https://resend.com)
- Configure `FROM_EMAIL` with your verified domain

### 2. Install Dependencies

From the root of the monorepo:

```bash
pnpm install
```

### 3. Development

Start the API server:

```bash
pnpm dev:api
```

Or run all services (API + Web):

```bash
pnpm dev:all
```

The API will be available at `http://localhost:3001`

### 4. Development Mode

In development mode, OTP codes are logged to the console instead of being emailed:

```
=================================
📧 OTP Code for: user@example.com
🔑 Code: 123456
=================================
```

## API Endpoints

### Authentication

#### POST `/auth/send-code`

Send OTP code to email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent"
}
```

#### POST `/auth/verify-code`

Verify OTP code and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### GET `/auth/me`

Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Health Check

#### GET `/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-26T00:00:00.000Z"
}
```

## Production Deployment

### Build

```bash
pnpm build:api
```

### Start

```bash
cd apps/api
node dist/index.js
```

### Production Considerations

1. **Database**: Replace in-memory storage with a real database (PostgreSQL, MongoDB, etc.)
2. **Redis**: Use Redis for OTP storage instead of in-memory Map
3. **Email**: Ensure Resend is configured with your production domain
4. **Security**:
   - Use a strong `JWT_SECRET`
   - Enable rate limiting
   - Add input validation
   - Implement HTTPS
5. **Monitoring**: Add logging and error tracking (Sentry, LogRocket, etc.)

## Architecture

```
apps/api/
├── src/
│   ├── index.ts           # Main server entry
│   ├── types.ts           # TypeScript types
│   ├── lib/
│   │   ├── email.ts       # Email sending with Resend
│   │   ├── otp.ts         # OTP generation and verification
│   │   └── users.ts       # User management
│   └── routes/
│       └── auth.ts        # Authentication endpoints
├── .env.example           # Example environment variables
└── package.json
```

## Technology Stack

- **Elysia**: Fast web framework for Bun
- **JWT**: Token-based authentication
- **Resend**: Email delivery service
- **TypeScript**: Type-safe development
