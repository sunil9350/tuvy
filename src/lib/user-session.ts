import { SignJWT, jwtVerify } from "jose";

export const USER_COOKIE = "tuvy_user";
const PAYLOAD_TYPE = "storefront" as const;

function getSecretBytes(): Uint8Array | null {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function signUserSession(userId: string): Promise<string> {
  const secret = getSecretBytes();
  if (!secret) {
    throw new Error("SESSION_SECRET must be set (min 16 characters).");
  }
  return new SignJWT({ typ: PAYLOAD_TYPE, uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyUserSession(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const secret = getSecretBytes();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.typ !== PAYLOAD_TYPE || typeof payload.uid !== "string") {
      return null;
    }
    return payload.uid;
  } catch {
    return null;
  }
}
