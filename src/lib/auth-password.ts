import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hash) {
    return bcrypt.compare(password, hash);
  }
  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) return false;
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(plain, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
