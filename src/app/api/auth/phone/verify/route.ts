import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpHash } from "@/lib/otp-code";
import { normalizeToE164 } from "@/lib/phone";
import { signUserSession, USER_COOKIE } from "@/lib/user-session";

const MAX_OTP_GUESSES = 5;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; code?: string };
    const norm = normalizeToE164(body.phone ?? "");
    if (!norm.ok) {
      return NextResponse.json({ error: norm.error }, { status: 400 });
    }
    const code = (body.code ?? "").replace(/\s/g, "");
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
    }

    const { e164 } = norm;
    const row = await prisma.phoneOtp.findFirst({
      where: { phoneE164: e164, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!row) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }
    if (row.attempts >= MAX_OTP_GUESSES) {
      await prisma.phoneOtp.delete({ where: { id: row.id } });
      return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 400 });
    }
    if (!verifyOtpHash(e164, code, row.codeHash)) {
      await prisma.phoneOtp.update({
        where: { id: row.id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    // Success
    await prisma.phoneOtp.delete({ where: { id: row.id } });

    const user = await prisma.user.upsert({
      where: { phoneE164: e164 },
      create: {
        phoneE164: e164,
        lastSeenAt: new Date(),
      },
      update: {
        lastSeenAt: new Date(),
      },
    });

    const token = await signUserSession(user.id);
    const res = NextResponse.json({ ok: true, userId: user.id });
    res.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
