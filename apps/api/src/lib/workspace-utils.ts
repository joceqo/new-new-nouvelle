import { randomBytes } from 'crypto';

// Constants
export const INVITE_EXPIRY_DAYS = 7;
export const WORKSPACE_NAME_MIN_LENGTH = 1;
export const WORKSPACE_NAME_MAX_LENGTH = 50;
export const WORKSPACE_SLUG_MAX_LENGTH = 50;

/**
 * Generate a cryptographically secure invite token
 * Uses 32 bytes of entropy for security
 */
export function generateInviteToken(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Validate workspace name
 * - Must be between 1-50 characters
 * - Must not be only whitespace
 */
export function validateWorkspaceName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Workspace name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length < WORKSPACE_NAME_MIN_LENGTH) {
    return { valid: false, error: 'Workspace name cannot be empty' };
  }

  if (trimmed.length > WORKSPACE_NAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Workspace name must be ${WORKSPACE_NAME_MAX_LENGTH} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Validate workspace slug
 * - Must be alphanumeric with hyphens
 * - Must not start or end with hyphen
 * - Must be between 1-50 characters
 */
export function validateWorkspaceSlug(slug: string): {
  valid: boolean;
  error?: string;
} {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Workspace slug is required' };
  }

  if (slug.length > WORKSPACE_SLUG_MAX_LENGTH) {
    return {
      valid: false,
      error: `Workspace slug must be ${WORKSPACE_SLUG_MAX_LENGTH} characters or less`,
    };
  }

  // Must be alphanumeric with hyphens, not starting/ending with hyphen
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return {
      valid: false,
      error:
        'Workspace slug must contain only lowercase letters, numbers, and hyphens (not at start/end)',
    };
  }

  return { valid: true };
}

/**
 * Sanitize workspace name
 * - Trim whitespace
 * - Remove control characters
 * - Normalize whitespace
 */
export function sanitizeWorkspaceName(name: string): string {
  return name
    .trim()
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Generate a unique slug from workspace name
 * - Converts to lowercase
 * - Replaces non-alphanumeric with hyphens
 * - Removes consecutive hyphens
 * - Adds random suffix for uniqueness
 */
export function generateSlugFromName(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .slice(0, 30); // Limit base slug length

  // Add random suffix for uniqueness (8 chars)
  const randomSuffix = randomBytes(4).toString('hex');
  return `${baseSlug}-${randomSuffix}`;
}

/**
 * Sanitize workspace icon (emoji or URL)
 * - Trim whitespace
 * - Validate URL if it looks like one
 */
export function sanitizeWorkspaceIcon(icon?: string): string | undefined {
  if (!icon) return undefined;

  const trimmed = icon.trim();
  if (!trimmed) return undefined;

  // If it looks like a URL, validate it
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      return url.toString();
    } catch {
      return undefined; // Invalid URL
    }
  }

  // Assume it's an emoji or short string, limit length
  return trimmed.slice(0, 10);
}

/**
 * Calculate invite expiry timestamp
 */
export function getInviteExpiryTimestamp(): number {
  return Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
}
