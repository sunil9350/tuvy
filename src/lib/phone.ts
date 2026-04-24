import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

const DEFAULT_REGION = (process.env.PHONE_OTP_DEFAULT_REGION ?? "IN") as CountryCode;

export function normalizeToE164(input: string): { ok: true; e164: string } | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter a phone number." };
  }
  const parsed = parsePhoneNumberFromString(trimmed, DEFAULT_REGION);
  if (!parsed || !parsed.isValid()) {
    return { ok: false, error: "Enter a valid mobile number." };
  }
  return { ok: true, e164: parsed.format("E.164") };
}
