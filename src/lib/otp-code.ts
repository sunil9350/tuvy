import { createHmac, randomInt } from "node:crypto";

function getOtpSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET must be set (min 16 characters).");
  }
  return s;
}

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(phoneE164: string, code: string): string {
  return createHmac("sha256", getOtpSecret()).update(`${phoneE164}:${code}`).digest("hex");
}

export function verifyOtpHash(phoneE164: string, code: string, hash: string): boolean {
  return hashOtp(phoneE164, code) === hash;
}
