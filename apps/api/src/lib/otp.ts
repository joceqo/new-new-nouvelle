import { randomInt } from 'crypto';
import { OTPStore } from '../types';
import { trackFailure } from './metrics';

// In-memory OTP storage (replace with Redis in production)
const otpStore = new Map<string, OTPStore>();

export function generateOTP(): string {
  // Use cryptographically secure random number generation
  return randomInt(100000, 1000000).toString().padStart(6, '0');
}

export function storeOTP(email: string, code: string): void {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  otpStore.set(email.toLowerCase(), {
    email,
    code,
    expiresAt,
    attempts: 0,
  });
}

export function verifyOTP(email: string, code: string): boolean {
  const stored = otpStore.get(email.toLowerCase());

  if (!stored) {
    trackFailure('otp.verification.detail', 'No OTP found for email', { email });
    return false;
  }

  // Check if expired
  if (stored.expiresAt < new Date()) {
    trackFailure('otp.verification.detail', 'OTP expired', {
      email,
      metadata: { expiresAt: stored.expiresAt.toISOString() },
    });
    otpStore.delete(email.toLowerCase());
    return false;
  }

  // Check attempts (max 5)
  if (stored.attempts >= 5) {
    trackFailure('otp.verification.detail', 'Max attempts exceeded', {
      email,
      metadata: { attempts: stored.attempts },
    });
    otpStore.delete(email.toLowerCase());
    return false;
  }

  // Increment attempts
  stored.attempts++;

  // Verify code
  if (stored.code !== code) {
    trackFailure('otp.verification.detail', 'Invalid code', {
      email,
      metadata: { attempts: stored.attempts },
    });
    return false;
  }

  // Success - remove from store
  otpStore.delete(email.toLowerCase());
  return true;
}

export function clearExpiredOTPs(): void {
  const now = new Date();
  for (const [email, stored] of otpStore.entries()) {
    if (stored.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}

// Clear expired OTPs every minute
setInterval(clearExpiredOTPs, 60 * 1000);
