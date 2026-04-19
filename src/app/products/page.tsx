import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { StorefrontProductGrid } from "@/components/storefront-product-grid";
import { getStorefrontProducts } from "@/lib/store-products";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteUrl();
  const url = `${site}/products`;
  const title = "All products | Tuvy";
  const description =
    "Browse the full Tuvy catalog—kitchen tools with links to Amazon, Flipkart, quick-commerce apps, and more.";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Tuvy",
      title: "All Tuvy products",
      description,
    },
    twitter: {
      card: "summary",
      title: "All Tuvy products",
      description,
    },
  };
}

export default async function ProductsArchivePage() {
  const products = await getStorefrontProducts();

  return (
    <SiteChrome>
      <main className="bg-background pb-nav md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav className="text-sm font-semibold text-muted" aria-label="Breadcrumb">
            <Link href="/" className="text-brand hover:underline">
              Home
            </Link>
            <span className="text-muted/60"> / </span>
            <span className="font-bold text-foreground">All products</span>
          </nav>

          <header className="mt-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              All products
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium text-muted sm:text-lg">
              Every Tuvy SKU in one place—open a product page for sharing, or jump straight to the
              retailer you prefer.
            </p>
          </header>

          <StorefrontProductGrid products={products} className="mt-10" />
        </div>
        <SiteFooter />
      </main>
    </SiteChrome>
  );
}
