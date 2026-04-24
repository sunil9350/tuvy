import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStorefrontAuthContext } from "@/lib/storefront-user";
import { normalizeToE164 } from "@/lib/phone";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | null;
};

export async function PATCH(request: Request) {
  const ctx = await getStorefrontAuthContext();
  if (!ctx) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const body = (await request.json()) as Body;
  const name = typeof body.name === "string" ? body.name.trim() || null : null;
  /** Google: email always from account. Phone sign-in: allow changing email in body. */
  const email =
    ctx.kind === "auth0"
      ? ctx.user.email
      : typeof body.email === "string"
        ? body.email.trim() || null
        : ctx.user.email;
  const dobStr = body.dateOfBirth;
  let dateOfBirth: Date | null = null;
  if (dobStr && typeof dobStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dobStr)) {
    const d = new Date(`${dobStr}T12:00:00.000Z`);
    if (!Number.isNaN(d.getTime())) dateOfBirth = d;
  } else {
    dateOfBirth = null;
  }

  let phoneE164: string | null = ctx.user.phoneE164;
  if (ctx.kind === "phone") {
    phoneE164 = ctx.user.phoneE164;
  } else if (body.phone != null) {
    const t = String(body.phone).trim();
    if (t) {
      const n = normalizeToE164(t);
      if (!n.ok) {
        return NextResponse.json({ error: n.error }, { status: 400 });
      }
      const other = await prisma.user.findFirst({
        where: {
          phoneE164: n.e164,
          NOT: { id: ctx.user.id },
        },
        select: { id: true },
      });
      if (other) {
        return NextResponse.json({ error: "That number is already on another account." }, { status: 409 });
      }
      phoneE164 = n.e164;
    } else {
      phoneE164 = null;
    }
  }

  await prisma.user.update({
    where: { id: ctx.user.id },
    data: {
      name,
      email,
      phoneE164,
      dateOfBirth,
      profileFormSavedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
