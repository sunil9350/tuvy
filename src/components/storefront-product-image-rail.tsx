type StorefrontProductImageRailProps = {
  images: string[];
  alt: string;
};

/** Horizontal snap-scroll gallery for cards (home /products). */
export function StorefrontProductImageRail({
  images,
  alt,
}: StorefrontProductImageRailProps) {
  const slides = images.filter(Boolean);
  if (slides.length === 0) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-card to-neutral-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.06]"
        aria-hidden
      />
    );
  }

  return (
    <div className="absolute inset-0 flex overflow-x-auto overscroll-x-contain snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="group/slide relative h-full min-w-full shrink-0 snap-center overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${alt} — photo ${i + 1} of ${slides.length}`}
            loading={i === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/slide:scale-[1.08]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}
