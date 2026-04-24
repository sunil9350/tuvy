import { NextResponse } from "next/server";
import { getStorefrontAuthContext } from "@/lib/storefront-user";
import type { UserMeResponse } from "@/lib/user-me-types";

function toIso(d: Date | null): string | null {
  return d ? d.toISOString() : null;
}

export async function GET() {
  const ctx = await getStorefrontAuthContext();
  if (!ctx) {
    return NextResponse.json({ authenticated: false } satisfies UserMeResponse);
  }

  const { user } = ctx;
  if (ctx.kind === "auth0") {
    const d = user.dateOfBirth;
    const showProfilePrompt = !user.profileDismissedAt && !user.profileFormSavedAt;
    return NextResponse.json({
      authenticated: true,
      provider: "auth0",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneE164: user.phoneE164,
        dateOfBirth: toIso(user.dateOfBirth),
        lastSeenAt: toIso(user.lastSeenAt),
        profileDismissedAt: toIso(user.profileDismissedAt),
        profileFormSavedAt: toIso(user.profileFormSavedAt),
      },
      prefill: {
        name: ctx.auth0Name ?? user.name ?? "",
        email: ctx.auth0Email ?? user.email ?? "",
        phone: user.phoneE164 ?? "",
        dateOfBirth: d ? d.toISOString().slice(0, 10) : "",
      },
      emailReadOnly: true,
      phoneReadOnly: false,
      showProfilePrompt,
      profileMode: "auth0",
    } satisfies UserMeResponse);
  }

  const d = user.dateOfBirth;
  const showProfilePrompt = !user.profileDismissedAt && !user.profileFormSavedAt;
  return NextResponse.json({
    authenticated: true,
    provider: "phone",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneE164: user.phoneE164,
      dateOfBirth: toIso(user.dateOfBirth),
      lastSeenAt: toIso(user.lastSeenAt),
      profileDismissedAt: toIso(user.profileDismissedAt),
      profileFormSavedAt: toIso(user.profileFormSavedAt),
    },
    prefill: {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phoneE164 ?? "",
      dateOfBirth: d ? d.toISOString().slice(0, 10) : "",
    },
    emailReadOnly: false,
    phoneReadOnly: true,
    showProfilePrompt,
    profileMode: "phone",
  } satisfies UserMeResponse);
}
