import { ConvexHttpClient } from 'convex/browser';
import { api } from '@nouvelle/convex/convex/_generated/api';

// Initialize Convex client
const convexUrl = process.env.CONVEX_URL;

if (!convexUrl) {
  throw new Error('CONVEX_URL environment variable is required');
}

export const convexClient = new ConvexHttpClient(convexUrl);

// Export API for type-safe function calls
export { api };
