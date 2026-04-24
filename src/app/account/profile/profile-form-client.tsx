"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProfileDetailsFields } from "@/components/profile-details-fields";
import type { UserMeResponse } from "@/lib/user-me-types";

export function AccountProfileFormClient() {
  const router = useRouter();
  const [me, setMe] = useState<UserMeResponse | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    void fetch("/api/user/me", { cache: "no-store" })
      .then((r) => r.json() as Promise<UserMeResponse>)
      .then((data) => {
        setMe(data);
        if (data.authenticated) {
          setName(data.prefill.name);
          setEmail(data.prefill.email);
          setPhone(data.prefill.phone);
          setDob(data.prefill.dateOfBirth);
        }
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (me && !me.authenticated) {
      router.replace("/auth/signin?next=" + encodeURIComponent("/account/profile"));
    }
  }, [me, router]);

  if (!me) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
        <div className="h-8 w-40 rounded-2xl bg-border/50 animate-pulse" />
      </div>
    );
  }

  if (!me.authenticated) {
    return null;
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const r = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          dateOfBirth: dob || null,
        }),
      });
      if (!r.ok) {
        const j = (await r.json()) as { error?: string };
        throw new Error(j.error ?? "Could not save");
      }
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-background pb-24 text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-md items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex size-10 items-center justify-center rounded-2xl border border-border text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Back home</span>
          </Link>
          <span className="text-sm font-extrabold">Profile</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-extrabold tracking-tight">Your details</h1>
        <p className="mt-2 text-sm text-muted">Update your name, date of birth, and other info.</p>

        <form onSubmit={onSave} className="mt-8 space-y-4">
          <ProfileDetailsFields
            me={me}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            dob={dob}
            setDob={setDob}
            idPrefix="account"
          />
          {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-extrabold text-white transition hover:bg-brand-hover disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}
