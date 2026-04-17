import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "tuvy_admin";

function getSecretBytes(): Uint8Array | null {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function signAdminSession(): Promise<string> {
  const secret = getSecretBytes();
  if (!secret) {
    throw new Error("SESSION_SECRET must be set (min 16 characters).");
  }
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = getSecretBytes();
  if (!secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
