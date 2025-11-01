import { randomInt } from 'crypto';
import { trackFailure } from './metrics';
import { otpLogger } from './logger';
import { convexClient, api } from './convex-client';

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

export function generateOTP(): string {
  // Use cryptographically secure random number generation
  return randomInt(100000, 1000000).toString().padStart(6, '0');
}

export async function storeOTP(email: string, code: string): Promise<void> {
  const expiresAt = Date.now() + OTP_EXPIRY_MS;
  await convexClient.mutation(api.otps.store, {
    email: email.toLowerCase(),
    code,
    expiresAt,
  });
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const stored = await convexClient.query(api.otps.getByEmail, {
    email: email.toLowerCase(),
  });

  if (!stored) {
    trackFailure('otp.verification.detail', 'No OTP found for email', { email });
    return false;
  }

  // Check if expired
  if (stored.expiresAt < Date.now()) {
    trackFailure('otp.verification.detail', 'OTP expired', {
      email,
      metadata: { expiresAt: new Date(stored.expiresAt).toISOString() },
    });
    await convexClient.mutation(api.otps.deleteOtp, { email: email.toLowerCase() });
    return false;
  }

  // Check attempts (max 5)
  if (stored.attempts >= 5) {
    trackFailure('otp.verification.detail', 'Max attempts exceeded', {
      email,
      metadata: { attempts: stored.attempts },
    });
    await convexClient.mutation(api.otps.deleteOtp, { email: email.toLowerCase() });
    return false;
  }

  // Increment attempts
  await convexClient.mutation(api.otps.incrementAttempts, { email: email.toLowerCase() });

  // Verify code
  if (stored.code !== code) {
    trackFailure('otp.verification.detail', 'Invalid code', {
      email,
      metadata: { attempts: stored.attempts + 1 },
    });
    return false;
  }

  // Success - remove from store
  await convexClient.mutation(api.otps.deleteOtp, { email: email.toLowerCase() });
  return true;
}

export async function clearExpiredOTPs(): Promise<void> {
  try {
    const count = await convexClient.mutation(api.otps.clearExpired, {});
    if (count > 0) {
      otpLogger.info({ count }, 'Cleared expired OTPs');
    }
  } catch (error) {
    otpLogger.error({ err: error }, 'Failed to clear expired OTPs');
  }
}

// Clear expired OTPs every minute
setInterval(clearExpiredOTPs, CLEANUP_INTERVAL_MS);
