import { OTPStore } from '../types';

// In-memory OTP storage (replace with Redis in production)
const otpStore = new Map<string, OTPStore>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    return false;
  }

  // Check if expired
  if (stored.expiresAt < new Date()) {
    otpStore.delete(email.toLowerCase());
    return false;
  }

  // Check attempts (max 5)
  if (stored.attempts >= 5) {
    otpStore.delete(email.toLowerCase());
    return false;
  }

  // Increment attempts
  stored.attempts++;

  // Verify code
  if (stored.code !== code) {
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
