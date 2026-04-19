import Link from "next/link";
import {
  BadgeCheck,
  Droplets,
  Leaf,
  Play,
  ShieldCheck,
  Sparkles,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { StorefrontProductGrid } from "@/components/storefront-product-grid";
import { getStorefrontProducts } from "@/lib/store-products";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";

const comparisons = [
  {
    title: "Chopping",
    old: "Dull knives, uneven cuts, and a board full of scraps.",
    tuvy: "One smooth motion—uniform pieces, faster prep, easier cleanup.",
    icon: UtensilsCrossed,
  },
  {
    title: "Spraying",
    old: "Gluggy oil, sticky bottles, and uneven coverage.",
    tuvy: "A fine, controlled mist—lighter meals, crispier finishes.",
    icon: Droplets,
  },
  {
    title: "Organizing",
    old: "Junk drawers, lost lids, and mystery containers.",
    tuvy: "Modular boxes that stack, seal, and stay easy to grab.",
    icon: Leaf,
  },
] as const;

/** Home reads live product data from the DB; avoid static prerender caching stale prices. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getStorefrontProducts();

  return (
    <SiteChrome>
      <main className="bg-background pb-nav md:pb-0">
        {/* Hero */}
        <section
          id="hero"
          className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-20"
        >
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <p className="inline-flex w-fit items-center rounded-2xl border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wide text-muted shadow-sm">
              Tidy + Utility
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Kitchen Tasks, Done in 10 Minutes.
            </h1>
            <p className="max-w-xl text-lg font-medium text-muted sm:text-xl">
              Make kitchen easy in 10 minutes—tools designed for real
              weeknights, not perfect photoshoots.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#collection"
                className="inline-flex items-center justify-center rounded-2xl bg-brand px-8 py-4 text-center text-base font-bold text-white shadow-md transition hover:bg-brand-hover"
              >
                Shop now
              </a>
              <a
                href="#compare"
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-8 py-4 text-center text-base font-semibold text-foreground shadow-sm transition hover:bg-white"
              >
                See the difference
              </a>
            </div>
            <p className="text-sm font-medium text-muted">
              Free shipping on bundles · 30-day happiness guarantee
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-card bg-gradient-to-br from-orange-50/90 via-card to-neutral-100 shadow-lg sm:aspect-video lg:aspect-[4/5]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-brand/15">
                  <Play
                    className="ml-1 size-8 fill-brand text-brand"
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-brand">
                    Demo video
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    High-energy kitchen wins
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Product video coming soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section
          id="compare"
          className="border-y border-border bg-background py-14 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                The old way vs. the Tuvy way
              </h2>
              <p className="mt-3 text-base font-medium text-muted sm:text-lg">
                Three everyday jobs—upgraded with tidy utility in mind.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {comparisons.map((c) => {
                const Icon = c.icon;
                return (
                  <article
                    key={c.title}
                    className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md"
                  >
                    <div className="flex items-center gap-3 border-b border-border bg-background/80 px-5 py-4">
                      <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-card text-brand shadow-sm ring-1 ring-border">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <h3 className="text-lg font-extrabold text-foreground">
                        {c.title}
                      </h3>
                    </div>
                    <div className="grid flex-1 gap-0 sm:grid-cols-2">
                      <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted">
                          The old way
                        </p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                          {c.old}
                        </p>
                      </div>
                      <div className="bg-gradient-to-b from-orange-50/50 to-card p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-brand">
                          The Tuvy way
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
                          {c.tuvy}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured collection */}
        <section id="collection" className="bg-background py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Top sellers
                </h2>
                <p className="mt-2 max-w-xl text-base font-medium text-muted">
                  Pick your app—each card opens Amazon, Flipkart, quick
                  commerce, and more in a new tab.
                </p>
              </div>
              <Link
                href="/products"
                className="hidden rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition hover:bg-white sm:inline-flex"
              >
                View all
              </Link>
            </div>
            <StorefrontProductGrid products={products} className="mt-10" />
          </div>
        </section>

        {/* Why Tuvy */}
        <section
          id="why"
          className="border-t border-border bg-background py-14 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Why Tuvy?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base font-medium text-muted sm:text-lg">
              We obsess over the small friction points that steal your
              evening—then remove them.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Quality Assured",
                  copy: "Materials tested for daily abuse—dishwasher-safe where it matters.",
                  icon: ShieldCheck,
                },
                {
                  title: "Fast Shipping",
                  copy: "Orders leave quickly so your “I’ll cook tonight” plan actually happens.",
                  icon: Truck,
                },
                {
                  title: "Problem Solver",
                  copy: "Every SKU earns its drawer space by saving real minutes, every week.",
                  icon: BadgeCheck,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card p-6 text-center shadow-md ring-1 ring-black/[0.03]"
                  >
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-brand ring-1 ring-brand/10">
                      <Icon className="size-7" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-muted">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section id="social" className="bg-background py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow-md">
                  <InstagramIcon className="size-6" aria-hidden />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    As seen on Instagram
                  </h2>
                  <p className="text-sm font-medium text-muted sm:text-base">
                    Real reels from real kitchens—swipe to preview the vibe.
                  </p>
                </div>
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition hover:bg-white"
              >
                <Sparkles className="size-4 text-brand" aria-hidden />
                Follow @tuvy
              </a>
            </div>
            <div className="mt-8 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {["Prep hack", "Mist mode", "Pantry reset", "Spotless sink"].map(
                (label, i) => (
                  <div
                    key={label}
                    className="relative w-[9.5rem] shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-md ring-1 ring-black/[0.03] sm:w-[11rem]"
                    style={{ aspectRatio: "9 / 16" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-white/90">
                        Reel {i + 1}
                      </p>
                      <p className="text-sm font-extrabold text-white">
                        {label}
                      </p>
                    </div>
                    <div className="flex h-full items-center justify-center">
                      <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                        Video placeholder
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="stores"
          className="scroll-mt-28 border-t border-border bg-card py-12 md:scroll-mt-24 md:py-16"
          aria-label="Where to buy"
        >
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand">
              Shop your way
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Available on the apps you already use
            </h2>
            <p className="mt-3 text-sm font-medium text-muted sm:text-base">
              Each product card links to trusted marketplaces and quick-commerce
              apps—tap through to the listing you prefer.
            </p>
            <a
              href="#collection"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-hover"
            >
              Browse top sellers
            </a>
          </div>
        </section>

        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
