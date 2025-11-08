/**
 * Test Mocks for Integration Testing
 *
 * These mocks replace Convex database calls when running in TEST_MODE.
 * They use in-memory storage and are reset between tests.
 *
 * IMPORTANT: These are for INTEGRATION tests only, not production!
 */

import { authLogger } from "./logger";

// In-memory storage for test data
const testUsers = new Map<string, { id: string; email: string; createdAt: number }>();
const testRefreshTokens = new Map<string, { userId: string; expiresAt: number }>();
const testOTPs = new Map<string, { code: string; expiresAt: number }>();

/**
 * Check if we're in test mode
 */
export function isTestMode(): boolean {
  return process.env.NODE_ENV === "test" || process.env.TEST_MODE === "true";
}

/**
 * Clear all test data (useful for test cleanup)
 */
export function clearTestData() {
  if (!isTestMode()) {
    throw new Error("clearTestData can only be called in test mode");
  }
  testUsers.clear();
  testRefreshTokens.clear();
  testOTPs.clear();
  authLogger.info("🧹 Test data cleared");
}

/**
 * Mock: Find or create a user by email
 */
export async function mockFindOrCreateUser(email: string): Promise<{ id: string; email: string }> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  // Check if user exists
  const existingUser = Array.from(testUsers.values()).find(u => u.email === email);

  if (existingUser) {
    authLogger.debug({ email }, "🧪 Mock: Found existing user");
    return { id: existingUser.id, email: existingUser.email };
  }

  // Create new user
  const newUser = {
    id: `test_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    createdAt: Date.now(),
  };

  testUsers.set(newUser.id, newUser);
  authLogger.info({ email, userId: newUser.id }, "🧪 Mock: Created new user");

  return { id: newUser.id, email: newUser.email };
}

/**
 * Mock: Find user by ID
 */
export async function mockFindUserById(userId: string): Promise<{ id: string; email: string } | null> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  const user = testUsers.get(userId);

  if (!user) {
    authLogger.debug({ userId }, "🧪 Mock: User not found");
    return null;
  }

  authLogger.debug({ userId, email: user.email }, "🧪 Mock: Found user");
  return { id: user.id, email: user.email };
}

/**
 * Mock: Store refresh token
 */
export async function mockStoreRefreshToken(
  userId: string,
  token: string,
  expiryDays: number
): Promise<void> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  const expiresAt = Date.now() + expiryDays * 24 * 60 * 60 * 1000;

  testRefreshTokens.set(token, {
    userId,
    expiresAt,
  });

  authLogger.debug(
    { userId, expiresAt: new Date(expiresAt).toISOString() },
    "🧪 Mock: Stored refresh token"
  );
}

/**
 * Mock: Verify refresh token
 */
export async function mockVerifyRefreshToken(token: string): Promise<string | null> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  const tokenData = testRefreshTokens.get(token);

  if (!tokenData) {
    authLogger.debug("🧪 Mock: Refresh token not found");
    return null;
  }

  if (tokenData.expiresAt < Date.now()) {
    authLogger.debug("🧪 Mock: Refresh token expired");
    testRefreshTokens.delete(token);
    return null;
  }

  authLogger.debug({ userId: tokenData.userId }, "🧪 Mock: Refresh token valid");
  return tokenData.userId;
}

/**
 * Mock: Revoke refresh token
 */
export async function mockRevokeRefreshToken(token: string): Promise<void> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  const deleted = testRefreshTokens.delete(token);

  if (deleted) {
    authLogger.debug("🧪 Mock: Refresh token revoked");
  } else {
    authLogger.debug("🧪 Mock: Refresh token not found (already revoked?)");
  }
}

/**
 * Mock: Store OTP
 */
export async function mockStoreOTP(email: string, code: string): Promise<void> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  testOTPs.set(email, {
    code,
    expiresAt,
  });

  authLogger.debug({ email }, "🧪 Mock: Stored OTP");
}

/**
 * Mock: Verify OTP
 */
export async function mockVerifyOTP(email: string, code: string): Promise<boolean> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  const otpData = testOTPs.get(email);

  if (!otpData) {
    authLogger.debug({ email }, "🧪 Mock: OTP not found");
    return false;
  }

  if (otpData.expiresAt < Date.now()) {
    authLogger.debug({ email }, "🧪 Mock: OTP expired");
    testOTPs.delete(email);
    return false;
  }

  if (otpData.code !== code) {
    authLogger.debug({ email }, "🧪 Mock: OTP code mismatch");
    return false;
  }

  // OTP is valid - delete it (one-time use)
  testOTPs.delete(email);
  authLogger.debug({ email }, "🧪 Mock: OTP verified successfully");

  return true;
}

/**
 * Mock: Clear expired OTPs (no-op in test mode)
 */
export async function mockClearExpiredOTPs(): Promise<void> {
  if (!isTestMode()) {
    throw new Error("Mock functions can only be used in test mode");
  }

  const now = Date.now();
  let cleared = 0;

  for (const [email, otpData] of testOTPs.entries()) {
    if (otpData.expiresAt < now) {
      testOTPs.delete(email);
      cleared++;
    }
  }

  if (cleared > 0) {
    authLogger.debug({ count: cleared }, "🧪 Mock: Cleared expired OTPs");
  }
}

// Export for test utilities
export const __testUtils = {
  getUsers: () => Array.from(testUsers.values()),
  getRefreshTokens: () => Array.from(testRefreshTokens.entries()),
  getOTPs: () => Array.from(testOTPs.entries()),
};
