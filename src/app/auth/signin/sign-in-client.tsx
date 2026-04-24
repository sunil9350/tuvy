"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

type Props = {
  auth0Enabled: boolean;
  returnTo: string;
};

export function SignInClient({ auth0Enabled, returnTo }: Props) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(j.error ?? "Could not send code");
      setStep("code");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const j = (await r.json()) as { error?: string };
      if (!r.ok) throw new Error(j.error ?? "Invalid code");
      window.location.href = returnTo;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-background pb-24 text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex size-10 items-center justify-center rounded-2xl border border-border text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back home</span>
          </Link>
          <span className="text-sm font-extrabold">Sign in</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">
          {auth0Enabled
            ? "Sign in with Google or with your phone number (OTP)."
            : "Sign in with your phone number (OTP). Add Auth0 env vars to enable Google."}
        </p>

        {!auth0Enabled && (
          <p className="mt-3 rounded-2xl border border-border bg-card px-3 py-2 text-sm text-muted">
            Google sign-in is off until you set <code className="font-mono text-foreground">AUTH0_DOMAIN</code>{" "}
            (host only, no <code className="font-mono">https://</code>),{" "}
            <code className="font-mono">AUTH0_CLIENT_ID</code>, <code className="font-mono">AUTH0_CLIENT_SECRET</code>, and{" "}
            <code className="font-mono">AUTH0_SECRET</code> (≥ 32 bytes). See <code className="font-mono">.env.example</code>.
          </p>
        )}

        {auth0Enabled && (
          <div className="mt-8">
            <a
              href={`/auth/login?connection=google-oauth2&returnTo=${encodeURIComponent(returnTo)}`}
              className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card py-2.5 pl-3 pr-4 text-sm font-extrabold text-foreground shadow-sm transition hover:border-brand/40"
            >
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </a>
          </div>
        )}

        {auth0Enabled && (
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase">
              <span className="bg-background px-3 text-muted">or phone</span>
            </div>
          </div>
        )}

        {!auth0Enabled && <div className="mt-8" />}

        {step === "phone" && (
          <form onSubmit={onSend} className="space-y-4">
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-bold">
                Mobile number
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                placeholder="e.g. 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                inputMode="tel"
              />
            </div>
            {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-extrabold text-white transition hover:bg-brand-hover disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Send code"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={onVerify} className="space-y-4">
            <p className="text-sm text-muted">
              Enter the 6-digit code we sent.{" "}
              <button
                type="button"
                className="font-bold text-brand hover:underline"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setErr(null);
                }}
              >
                Use a different number
              </button>
            </p>
            <div>
              <label htmlFor="code" className="mb-1.5 block text-sm font-bold">
                Verification code
              </label>
              <input
                id="code"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm tracking-[0.2em] placeholder:tracking-normal"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
              />
            </div>
            {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-extrabold text-white transition hover:bg-brand-hover disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify & sign in"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
