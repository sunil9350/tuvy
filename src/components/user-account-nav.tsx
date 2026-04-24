"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogIn, LogOut, User2, UserCircle2 } from "lucide-react";
import type { UserMeResponse } from "@/lib/user-me-types";

export function UserAccountNav() {
  const [me, setMe] = useState<UserMeResponse | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(() => {
    void fetch("/api/user/me", { cache: "no-store" })
      .then((r) => r.json() as Promise<UserMeResponse>)
      .then(setMe);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!me) {
    return (
      <div className="h-8 w-20 shrink-0 rounded-2xl bg-border/50 animate-pulse" aria-hidden />
    );
  }

  if (!me.authenticated) {
    return (
      <Link
        href="/auth/signin"
        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card px-3 text-sm font-bold text-foreground transition hover:border-brand/30 hover:text-brand"
      >
        <LogIn className="size-4" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  const label =
    me.user.name?.trim() ||
    me.user.email?.trim() ||
    me.user.phoneE164 ||
    (me.provider === "auth0" ? "Account" : "Account");

  const signOut = async () => {
    if (me.provider === "auth0") {
      window.location.href = "/auth/logout?returnTo=/";
    } else {
      await fetch("/api/auth/phone/logout", { method: "POST" });
      window.location.href = "/";
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex min-h-10 max-w-[12rem] items-center justify-center gap-1 rounded-2xl border border-border bg-card py-1.5 pl-2 pr-1.5 text-left text-sm font-bold text-foreground transition hover:border-brand/30"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User2 className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate sm:max-w-[7rem]">{label}</span>
        <ChevronDown className="size-4 shrink-0 text-muted" />
        <span className="sr-only">Account menu</span>
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default bg-black/0 md:bg-transparent"
            tabIndex={-1}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-40 mt-1 min-w-[10rem] rounded-2xl border border-border bg-card p-1 shadow-lg"
          >
            <p className="px-3 py-2 text-xs text-muted" role="presentation">
              Signed in
              {me.provider === "phone" && " with phone"}
              {me.provider === "auth0" && " with Google"}
            </p>
            <Link
              href="/account/profile"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-background"
              onClick={() => setOpen(false)}
            >
              <UserCircle2 className="size-4" />
              Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-background"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
