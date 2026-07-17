import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12;

export function normalizeWhatsapp(value: string): string {
  return String(value ?? "").replace(/\s/g, "");
}

export function isValidWhatsapp(value: string): boolean {
  return /^\+?[0-9]{7,15}$/.test(value);
}

export function normalizePin(value: string): string {
  return String(value ?? "").trim();
}

export function isValidPin(value: string): boolean {
  return /^\d{4,8}$/.test(value);
}

/**
 * Hash a seller PIN using bcrypt with a salt factor of 12.
 * bcrypt is intentionally slow (CPU/memory intensive) to resist brute-force attacks.
 * Each PIN gets a unique salt automatically.
 */
export async function hashSellerPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, BCRYPT_SALT_ROUNDS);
}

/**
 * Verify a seller PIN against a bcrypt hash.
 * Returns true if the PIN matches the hash.
 */
export async function verifySellerPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}