/**
 * Sends SMS for phone OTP. When Twilio env is set, uses the REST API; otherwise
 * in development logs the code; in production without Twilio, throws.
 */
export async function sendPhoneOtpSms(phoneE164: string, code: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (sid && token && from) {
    const body = new URLSearchParams();
    body.set("To", phoneE164);
    body.set("From", from);
    body.set("Body", `Your Tuvy verification code is: ${code}`);

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      },
    );
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`SMS send failed: ${res.status} ${t}`);
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    // Dev-only: log the OTP when Twilio is not configured.
    console.info(`[SMS / dev] ${phoneE164} OTP: ${code}`);
    return;
  }

  throw new Error("SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.");
}
