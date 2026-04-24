"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProfileDetailsFields } from "@/components/profile-details-fields";
import type { UserMeResponse } from "@/lib/user-me-types";

export function OptionalProfileModal() {
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
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  if (!me?.authenticated || !me.showProfilePrompt) {
    return null;
  }

  const onSkip = async () => {
    setSaving(true);
    setErr(null);
    try {
      const r = await fetch("/api/user/skip-profile", { method: "POST" });
      if (!r.ok) {
        const j = (await r.json()) as { error?: string };
        throw new Error(j.error ?? "Could not continue");
      }
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 pb-24 sm:items-center sm:pb-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-prompt-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2 id="profile-prompt-title" className="text-lg font-extrabold text-foreground">
              Your details
            </h2>
            <p className="mt-1 text-sm text-muted">
              {me.profileMode === "auth0"
                ? "Optional — add a phone so we can reach you about orders. You can skip anytime."
                : "Optional — tell us a bit more so we can improve your experience. You can skip anytime."}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl border border-border text-foreground"
            onClick={onSkip}
            disabled={saving}
            aria-label="Skip for now"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3">
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
            idPrefix="onboard"
          />
          {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-2xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-background"
              onClick={onSkip}
              disabled={saving}
            >
              Skip
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
