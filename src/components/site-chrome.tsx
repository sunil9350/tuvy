"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Menu, ShoppingBag, Sparkles, X } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { UserAccountNav } from "@/components/user-account-nav";

const navLinks = [
  { href: "#compare", label: "Old vs Tuvy" },
  { href: "#collection", label: "Top sellers" },
  { href: "#why", label: "Why Tuvy" },
  { href: "#social", label: "On Instagram" },
  { href: "#stores", label: "Where to buy" },
] as const;

function scrollToId(id: string) {
  const el = document.querySelector(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          {isHome ? (
            <a
              href="#hero"
              className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("#hero");
              }}
            >
              Tuvy
            </a>
          ) : (
            <Link
              href="/"
              className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl"
            >
              Tuvy
            </Link>
          )}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {navLinks.map((l) =>
              isHome ? (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-semibold text-muted transition hover:text-foreground"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={`/${l.href}`}
                  className="text-sm font-semibold text-muted transition hover:text-foreground"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              <UserAccountNav />
            </div>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-2xl border border-border text-foreground md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-extrabold">Menu</span>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-2xl border border-border"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((l) =>
                isHome ? (
                  <a
                    key={l.href}
                    href={l.href}
                    className="rounded-2xl px-4 py-3 text-base font-semibold text-foreground hover:bg-background"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.href}
                    href={`/${l.href}`}
                    className="rounded-2xl px-4 py-3 text-base font-semibold text-foreground hover:bg-background"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      )}

      {children}

      {/* Mobile-first sticky bottom bar for social traffic */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur md:hidden"
        aria-label="Quick navigation"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
          <BottomTab
            icon={<Home className="size-5" />}
            label="Home"
            href={isHome ? undefined : "/#hero"}
            onClick={isHome ? () => scrollToId("#hero") : undefined}
          />
          <BottomTab
            icon={<LayoutGrid className="size-5" />}
            label="Shop"
            href={isHome ? undefined : "/#collection"}
            onClick={isHome ? () => scrollToId("#collection") : undefined}
          />
          <BottomTab
            icon={<Sparkles className="size-5" />}
            label="Why"
            href={isHome ? undefined : "/#why"}
            onClick={isHome ? () => scrollToId("#why") : undefined}
          />
          <BottomTab
            icon={<InstagramIcon className="size-5" aria-hidden />}
            label="Reels"
            href={isHome ? undefined : "/#social"}
            onClick={isHome ? () => scrollToId("#social") : undefined}
          />
          <BottomTab
            icon={<ShoppingBag className="size-5" />}
            label="Bag"
            href={isHome ? undefined : "/#collection"}
            onClick={isHome ? () => scrollToId("#collection") : undefined}
          />
        </div>
      </nav>
    </>
  );
}

function BottomTab({
  icon,
  label,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-muted";
  const inner = (
    <>
      <span className="text-foreground">{icon}</span>
      {label}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}
