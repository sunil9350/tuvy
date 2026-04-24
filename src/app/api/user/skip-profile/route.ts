import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStorefrontAuthContext } from "@/lib/storefront-user";

export async function POST() {
  const ctx = await getStorefrontAuthContext();
  if (!ctx) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  await prisma.user.update({
    where: { id: ctx.user.id },
    data: { profileDismissedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
