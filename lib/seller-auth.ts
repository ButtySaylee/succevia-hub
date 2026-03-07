import { createHash } from "crypto";

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

export function hashSellerPin(pin: string): string {
  const secret = process.env.SELLER_PIN_SECRET;
  if (!secret) {
    throw new Error("SELLER_PIN_SECRET is not configured");
  }

  return createHash("sha256").update(`${secret}:${pin}`).digest("hex");
}
