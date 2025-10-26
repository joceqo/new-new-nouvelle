# @nouvelle/convex

Convex backend package for Nouvelle - connects to self-hosted Convex running in Docker.

## Setup

1. Make sure Docker services are running:
   ```bash
   npm run docker:up:dashboard
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run Convex dev (watches for schema/function changes):
   ```bash
   pnpm dev
   ```

## Structure

- `convex/schema.ts` - Database schema definitions
- `convex/users.ts` - User-related queries and mutations
- `convex/_generated/` - Auto-generated types (created by Convex CLI)

## Usage

This package connects to the self-hosted Convex backend running at `http://127.0.0.1:3210`.

The Convex dev command will:
- Watch for changes to schema and functions
- Auto-generate TypeScript types
- Deploy changes to your local Convex backend

## Environment Variables

Set in `.env.local`:
- `CONVEX_SELF_HOSTED_URL` - URL of your Convex backend
- `CONVEX_SELF_HOSTED_ADMIN_KEY` - Admin key for authentication
