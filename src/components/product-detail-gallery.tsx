"use client";

import { useState } from "react";
import { Package } from "lucide-react";

type ProductDetailGalleryProps = {
  images: string[];
  productName: string;
  children?: React.ReactNode;
};

export function ProductDetailGallery({
  images,
  productName,
  children,
}: ProductDetailGalleryProps) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const current = slides[index];

  if (slides.length === 0) {
    return (
      <div className="flex w-full min-w-0 flex-col">
        <div className="relative aspect-[4/3] max-w-full bg-gradient-to-br from-neutral-100 via-card to-orange-50/30 sm:aspect-[5/4] lg:aspect-[4/5]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
              <Package className="size-8" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="text-sm font-semibold text-muted">Product photo coming soon</p>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="group/main relative aspect-[4/3] max-w-full overflow-hidden bg-gradient-to-br from-neutral-100 via-card to-orange-50/30 sm:aspect-[5/4] lg:aspect-[4/5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={`${productName} — ${index + 1} of ${slides.length}`}
          className="absolute inset-0 h-full w-full max-w-none object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:group-hover/main:scale-[1.08] lg:group-hover/main:scale-[1.12]"
          fetchPriority="high"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand/10 via-transparent to-amber-200/15"
          aria-hidden
        />
        {children}
      </div>

      {slides.length > 1 ? (
        <div className="min-w-0 border-t border-border/70 bg-card/80 px-2 py-2.5 backdrop-blur-sm">
          <p className="mb-2 px-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">
            Gallery · swipe or tap
          </p>
          <div className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden">
            {slides.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative h-16 w-[4.5rem] shrink-0 snap-start overflow-hidden rounded-xl ring-2 transition sm:h-[4.5rem] sm:w-20 ${
                  i === index
                    ? "ring-brand shadow-md shadow-brand/20"
                    : "ring-transparent opacity-80 hover:opacity-100"
                }`}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
