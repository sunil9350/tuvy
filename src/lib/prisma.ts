import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

/**
 * Invalidate the cached Prisma client when the schema or generated client changes
 * (e.g. after `prisma migrate` + `prisma generate`). Otherwise `next dev` can keep a
 * singleton that still targets dropped columns like `imageUrl`.
 */
function prismaClientFingerprint(): string {
  try {
    const schema = readFileSync(join(process.cwd(), "prisma", "schema.prisma"));
    const generated = readFileSync(
      join(process.cwd(), "node_modules", ".prisma", "client", "schema.prisma"),
    );
    return createHash("sha256").update(schema).update(generated).digest("hex").slice(0, 24);
  } catch {
    return "prisma-fingerprint-unavailable";
  }
}

type PrismaGlobal = {
  __tuvy_prisma?: { client: PrismaClient; fp: string };
};

const g = globalThis as typeof globalThis & PrismaGlobal;

export const prisma: PrismaClient = (() => {
  const fp = prismaClientFingerprint();
  const cur = g.__tuvy_prisma;
  if (cur?.fp === fp) {
    return cur.client;
  }
  void cur?.client.$disconnect().catch(() => {});
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  g.__tuvy_prisma = { client, fp };
  return client;
})();
