import { cookies } from "next/headers";
import { getAuth0, isAuth0Configured } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { USER_COOKIE, verifyUserSession } from "@/lib/user-session";
import type { User } from "@prisma/client";

const ENGAGEMENT_THROTTLE_MS = 2 * 60 * 1000;

/**
 * Create/update the Auth0-backed user, or update last seen for a phone user.
 * Call from the root layout so Prisma only runs in Node, not the Edge auth pipeline.
 */
export async function syncStorefrontUserEngagement(): Promise<void> {
  if (isAuth0Configured()) {
    const session = await getAuth0().getSession();
    if (session?.user?.sub) {
      const u = session.user;
      const sub = u.sub;
      const now = new Date();
      const row = await prisma.user.findUnique({ where: { auth0Sub: sub } });
      if (!row || !row.lastSeenAt || now.getTime() - row.lastSeenAt.getTime() > ENGAGEMENT_THROTTLE_MS) {
        await prisma.user.upsert({
          where: { auth0Sub: sub },
          create: {
            auth0Sub: sub,
            email: u.email ?? null,
            name: u.name ?? (u as { nickname?: string }).nickname ?? null,
            lastSeenAt: now,
          },
          update: {
            email: u.email ?? undefined,
            name: u.name ?? (u as { nickname?: string }).nickname ?? undefined,
            lastSeenAt: now,
          },
        });
      }
      return;
    }
  }

  const token = (await cookies()).get(USER_COOKIE)?.value;
  const userId = await verifyUserSession(token);
  if (!userId) return;
  const now = new Date();
  const row = await prisma.user.findUnique({ where: { id: userId } });
  if (
    row &&
    (!row.lastSeenAt || now.getTime() - row.lastSeenAt.getTime() > ENGAGEMENT_THROTTLE_MS)
  ) {
    await prisma.user.update({ where: { id: userId }, data: { lastSeenAt: now } });
  }
}

export type StorefrontAuthContext =
  | { kind: "auth0"; user: User; auth0Name: string | null; auth0Email: string | null; auth0Picture: string | null }
  | { kind: "phone"; user: User }
  | null;

export async function getStorefrontAuthContext(): Promise<StorefrontAuthContext> {
  if (isAuth0Configured()) {
    const session = await getAuth0().getSession();
    if (session?.user?.sub) {
      const su = session.user;
      let u = await prisma.user.findUnique({ where: { auth0Sub: su.sub } });
      if (!u) {
        u = await prisma.user.create({
          data: {
            auth0Sub: su.sub,
            email: su.email ?? null,
            name: su.name ?? (su as { nickname?: string }).nickname ?? null,
            lastSeenAt: new Date(),
          },
        });
      }
      return {
        kind: "auth0",
        user: u,
        auth0Name: su.name ?? null,
        auth0Email: su.email ?? null,
        auth0Picture: (su as { picture?: string }).picture ?? null,
      };
    }
  }
  const token = (await cookies()).get(USER_COOKIE)?.value;
  const userId = await verifyUserSession(token);
  if (!userId) return null;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) return null;
  return { kind: "phone", user: u };
}
