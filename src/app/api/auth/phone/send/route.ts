import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtpCode, hashOtp } from "@/lib/otp-code";
import { normalizeToE164 } from "@/lib/phone";
import { sendPhoneOtpSms } from "@/lib/sms";

const SEND_WINDOW_MS = 60 * 60 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const OTP_TTL_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const norm = normalizeToE164(body.phone ?? "");
    if (!norm.ok) {
      return NextResponse.json({ error: norm.error }, { status: 400 });
    }
    const { e164 } = norm;

    const since = new Date(Date.now() - SEND_WINDOW_MS);
    const recent = await prisma.phoneOtp.count({
      where: { phoneE164: e164, createdAt: { gte: since } },
    });
    if (recent >= MAX_SENDS_PER_HOUR) {
      return NextResponse.json(
        { error: "Too many code requests. Try again later." },
        { status: 429 },
      );
    }

    await prisma.phoneOtp.deleteMany({ where: { phoneE164: e164 } });

    const code = generateOtpCode();
    const codeHash = hashOtp(e164, code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.phoneOtp.create({
      data: { phoneE164: e164, codeHash, expiresAt },
    });

    await sendPhoneOtpSms(e164, code);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
