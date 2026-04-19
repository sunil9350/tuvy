import Link from "next/link";
import { ProductRetailers } from "@/components/product-retailers";
import { StorefrontProductImageRail } from "@/components/storefront-product-image-rail";
import type { StorefrontProduct } from "@/lib/store-products";

type StorefrontProductGridProps = {
  products: StorefrontProduct[];
  className?: string;
};

export function StorefrontProductGrid({
  products,
  className = "",
}: StorefrontProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center ${className}`.trim()}
      >
        <p className="text-sm font-semibold text-foreground">Catalog updating soon.</p>
        <p className="mt-2 text-sm font-medium text-muted">
          New arrivals will appear here. Thank you for your patience.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-3 ${className}`.trim()}>
      {products.map((p) => (
        <article
          key={p.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border/90 bg-card shadow-md ring-1 ring-black/[0.03] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-brand/15"
        >
          <Link
            href={`/products/${p.slug}`}
            className="relative block aspect-[4/3] overflow-hidden bg-neutral-100 outline-none ring-brand/40 focus-visible:ring-2"
          >
            <div className="absolute inset-0">
              <StorefrontProductImageRail images={p.images} alt={p.name} />
            </div>
            {p.images.length > 1 ? (
              <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur-sm">
                {p.images.length} photos
              </span>
            ) : null}
            <span className="pointer-events-none absolute left-4 top-4 z-10 translate-y-1 rounded-2xl bg-brand px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white opacity-0 shadow-md ring-1 ring-black/10 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              10-Min Hack
            </span>
            <span className="absolute right-4 top-4 z-10 rounded-2xl bg-card/95 px-3 py-1 text-xs font-bold text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm">
              {p.tag}
            </span>
          </Link>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-extrabold leading-tight tracking-tight text-foreground">
                <Link
                  href={`/products/${p.slug}`}
                  className="hover:text-brand focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  {p.name}
                </Link>
              </h3>
              <p className="shrink-0 rounded-2xl bg-background px-3 py-1 text-sm font-extrabold text-brand ring-1 ring-brand/15">
                {p.price}
              </p>
            </div>
            <p className="text-sm font-medium leading-relaxed text-muted">
              <Link
                href={`/products/${p.slug}`}
                className="hover:text-foreground focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                {p.blurb}
              </Link>
            </p>
            <div className="mt-1">
              <ProductRetailers productName={p.name} links={p.retailers} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
