import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductDetailGallery } from "@/components/product-detail-gallery";
import { ProductRetailers } from "@/components/product-retailers";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { getStorefrontProductBySlug } from "@/lib/store-products";
import { getSiteUrl } from "@/lib/site-url";

/** Live catalog (prices, images) should match the home storefront. */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function summarizeForMeta(text: string, max = 155): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function absoluteOgImage(site: string, imageUrl: string | null): string | undefined {
  if (!imageUrl?.trim()) return undefined;
  const u = imageUrl.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${site}${u}`;
  return `${site}/${u}`;
}

function primaryImage(images: string[]): string | null {
  const u = images[0]?.trim();
  return u || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const site = getSiteUrl();
  const url = `${site}/products/${product.slug}`;
  const title = `${product.name} | Tuvy`;
  const description = summarizeForMeta(product.blurb);
  const ogImage = absoluteOgImage(site, primaryImage(product.images));

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Tuvy",
      title: product.name,
      description: product.blurb,
      images: ogImage ? [{ url: ogImage, alt: product.name }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: product.name,
      description: product.blurb,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

const trustPoints = [
  { icon: Truck, label: "Fast dispatch", sub: "Bundles ship quickly" },
  { icon: ShieldCheck, label: "30-day guarantee", sub: "Shop with confidence" },
  { icon: Sparkles, label: "10-minute wins", sub: "Built for real weeknights" },
] as const;

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) notFound();

  const site = getSiteUrl();
  const url = `${site}/products/${product.slug}`;
  const resolvedImages = product.images
    .map((u) => absoluteOgImage(site, u))
    .filter((x): x is string => Boolean(x));

  const priceDigits = product.price.replace(/[^\d.]/g, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.blurb,
    image: resolvedImages.length ? resolvedImages : undefined,
    brand: { "@type": "Brand", name: "Tuvy" },
    offers: {
      "@type": "Offer",
      url,
      ...(priceDigits
        ? { priceCurrency: "INR" as const, price: priceDigits }
        : {}),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <SiteChrome>
      <main className="relative overflow-x-hidden bg-background pb-nav md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Page atmosphere */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-[min(52rem,120%)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,79,0,0.18),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 top-32 size-[28rem] rounded-full bg-gradient-to-bl from-amber-200/35 via-orange-100/20 to-transparent blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-[22rem] size-[20rem] rounded-full bg-gradient-to-tr from-brand/10 via-transparent to-transparent blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <nav
            className="inline-flex max-w-full min-w-0 flex-wrap items-center gap-1 rounded-2xl border border-border/80 bg-card/90 px-3 py-2 text-xs font-semibold text-muted shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm sm:text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-foreground/80 transition hover:text-brand"
            >
              Home
            </Link>
            <ChevronRight
              className="size-3.5 shrink-0 text-muted/50"
              aria-hidden
            />
            <Link
              href="/products"
              className="text-foreground/80 transition hover:text-brand"
            >
              Products
            </Link>
            <ChevronRight
              className="size-3.5 shrink-0 text-muted/50"
              aria-hidden
            />
            <span className="truncate font-bold text-foreground">
              {product.name}
            </span>
          </nav>

          <div className="mt-8 grid min-w-0 gap-10 lg:mt-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            {/* Gallery */}
            <div className="min-w-0 max-w-full lg:col-span-5">
              <div className="relative isolate">
                <div
                  className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-brand/35 via-orange-200/40 to-amber-100/50 opacity-90 blur-sm sm:rounded-[1.65rem]"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-card shadow-[0_24px_60px_-12px_rgba(15,15,15,0.18)] ring-1 ring-black/[0.06] sm:rounded-[1.5rem]">
                  <ProductDetailGallery images={product.images} productName={product.name}>
                    <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2 sm:left-5 sm:top-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white shadow-lg shadow-brand/25 ring-1 ring-white/20">
                        <Sparkles className="size-3.5" aria-hidden />
                        Tuvy pick
                      </span>
                      <span className="rounded-full bg-card/95 px-3 py-1 text-xs font-bold text-foreground shadow-md ring-1 ring-border/90 backdrop-blur-md">
                        {product.tag}
                      </span>
                    </div>
                  </ProductDetailGallery>
                </div>
              </div>
            </div>

            {/* Copy + commerce */}
            <div className="flex min-w-0 flex-col gap-6 lg:col-span-7 lg:gap-7">
              <header className="min-w-0 space-y-4">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-brand">
                  <span
                    className="h-px w-6 bg-gradient-to-r from-brand to-transparent"
                    aria-hidden
                  />
                  Shop the listing
                </p>
                <h1 className="break-words text-[1.65rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[2.35rem] lg:leading-[1.06]">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-baseline gap-1 rounded-2xl bg-gradient-to-br from-brand to-[#e04700] px-5 py-3 text-white shadow-lg shadow-brand/30 ring-1 ring-white/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                      From
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight sm:text-[1.65rem]">
                      {product.price}
                    </span>
                  </div>
                  <p className="max-w-[14rem] text-xs font-semibold leading-snug text-muted sm:text-sm">
                    Price shown is indicative—final price is on the retailer you
                    choose.
                  </p>
                </div>
              </header>

              <section
                className="min-w-0 rounded-2xl border border-border/90 bg-gradient-to-br from-card via-card to-orange-50/[0.35] p-5 shadow-md ring-1 ring-black/[0.04] sm:p-6"
                aria-labelledby="product-story"
              >
                <h2 id="product-story" className="sr-only">
                  About this product
                </h2>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">
                  Why it earns a drawer
                </p>
                <p className="mt-3 break-words text-base font-medium leading-relaxed text-foreground/90 sm:text-lg">
                  {product.blurb}
                </p>
              </section>

              <section
                className="min-w-0 overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-b from-brand/[0.06] via-card to-card shadow-lg ring-1 ring-black/[0.04]"
                aria-labelledby="where-to-buy"
              >
                <div className="border-b border-brand/10 bg-gradient-to-r from-brand/10 via-transparent to-amber-100/20 px-4 py-3.5 sm:px-5">
                  <h2
                    id="where-to-buy"
                    className="text-sm font-extrabold tracking-tight text-foreground sm:text-base"
                  >
                    Get it where you already shop
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-muted sm:text-sm">
                    Marketplace links open in a new tab—pick Amazon, Flipkart,
                    quick apps, and more.
                  </p>
                </div>
                <div className="p-4 sm:p-5">
                  <ProductRetailers
                    productName={product.name}
                    links={product.retailers}
                  />
                </div>
              </section>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-2 lg:grid-cols-1 xl:grid-cols-3">
                {trustPoints.map(({ icon: Icon, label, sub }) => (
                  <li
                    key={label}
                    className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/90 px-4 py-3 shadow-sm ring-1 ring-black/[0.03]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand ring-1 ring-brand/10">
                      <Icon className="size-5" strokeWidth={2} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-foreground">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-muted">
                        {sub}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-5 py-3 text-center text-sm font-bold text-foreground shadow-sm transition hover:border-brand/25 hover:bg-white hover:text-brand"
                >
                  ← Browse all products
                </Link>
                <Link
                  href="/#collection"
                  className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 text-center text-sm font-extrabold text-white shadow-md shadow-brand/25 transition hover:bg-brand-hover"
                >
                  Back to home picks
                </Link>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
