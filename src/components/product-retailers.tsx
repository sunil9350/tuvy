const RETAILERS = [
  {
    id: "amazon",
    label: "Amazon",
    tier: "primary" as const,
    className:
      "bg-gradient-to-b from-[#2a3b52] to-[#232F3E] text-white shadow-lg shadow-[#232F3E]/35 ring-1 ring-white/15 hover:brightness-110 active:scale-[0.98]",
  },
  {
    id: "flipkart",
    label: "Flipkart",
    tier: "primary" as const,
    className:
      "bg-gradient-to-b from-[#3d8af7] to-[#2874F0] text-white shadow-lg shadow-[#2874F0]/35 ring-1 ring-white/15 hover:brightness-110 active:scale-[0.98]",
  },
  {
    id: "instamart",
    label: "Instamart",
    tier: "quick" as const,
    className:
      "bg-gradient-to-b from-[#ff9339] to-[#FC8019] text-white shadow-md shadow-orange-500/25 ring-1 ring-white/20 hover:brightness-105 active:scale-[0.98]",
  },
  {
    id: "blinkit",
    label: "Blinkit",
    tier: "quick" as const,
    className:
      "bg-gradient-to-b from-[#ffe566] to-[#FFD208] text-[#1a1a1a] shadow-md shadow-amber-400/30 ring-1 ring-black/10 hover:brightness-105 active:scale-[0.98]",
  },
  {
    id: "zepto",
    label: "Zepto",
    tier: "quick" as const,
    className:
      "bg-gradient-to-b from-[#7029e8] to-[#5C1AC5] text-white shadow-md shadow-violet-600/30 ring-1 ring-white/15 hover:brightness-105 active:scale-[0.98]",
  },
  {
    id: "bigbasket",
    label: "BigBasket",
    tier: "quick" as const,
    className:
      "bg-gradient-to-b from-[#9ad63a] to-[#84c225] text-white shadow-md shadow-lime-600/25 ring-1 ring-white/20 hover:brightness-105 active:scale-[0.98]",
  },
  {
    id: "jiomart",
    label: "JioMart",
    tier: "quick" as const,
    className:
      "bg-gradient-to-b from-[#0090c9] to-[#0078AD] text-white shadow-md shadow-sky-700/25 ring-1 ring-white/15 hover:brightness-105 active:scale-[0.98]",
  },
  {
    id: "nykaa",
    label: "Nykaa",
    tier: "quick" as const,
    className:
      "bg-gradient-to-b from-[#ff4a93] to-[#FC2779] text-white shadow-md shadow-pink-600/25 ring-1 ring-white/15 hover:brightness-105 active:scale-[0.98]",
  },
  {
    id: "dmart",
    label: "DMart",
    tier: "quick" as const,
    className:
      "bg-gradient-to-b from-[#0d8f66] to-[#0B6E4F] text-white shadow-md shadow-emerald-800/25 ring-1 ring-white/15 hover:brightness-105 active:scale-[0.98]",
  },
] as const;

export type RetailerId = (typeof RETAILERS)[number]["id"];

export type RetailerLinks = Partial<Record<RetailerId, string>>;

type RetailerEntry = (typeof RETAILERS)[number] & { href: string };

type ProductRetailersProps = {
  productName: string;
  links: RetailerLinks;
};

export function ProductRetailers({ productName, links }: ProductRetailersProps) {
  const resolved: RetailerEntry[] = RETAILERS.flatMap((r) => {
    const href = links[r.id]?.trim();
    return href ? [{ ...r, href }] : [];
  });

  if (resolved.length === 0) {
    return (
      <p className="text-center text-xs font-medium text-muted">
        Store links for {productName} are not configured yet.
      </p>
    );
  }

  const primary = resolved.filter((r) => r.tier === "primary");
  const quick = resolved.filter((r) => r.tier === "quick");

  const showPrimary = primary.length > 0;
  const showQuick = quick.length > 0;
  const onlyQuick = !showPrimary && showQuick;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.07] via-orange-50/40 to-background p-3 shadow-inner ring-1 ring-black/[0.03]">
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-brand/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-6 size-28 rounded-full bg-orange-300/20 blur-2xl"
        aria-hidden
      />

      <div className="relative flex items-center justify-between gap-2 pb-2.5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand">Shop</p>
        <span className="rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-bold text-muted shadow-sm ring-1 ring-border">
          Opens in new tab
        </span>
      </div>

      {showPrimary && (
        <div
          className={`relative grid gap-2 ${primary.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {primary.map((r) => (
            <a
              key={r.id}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[3rem] items-center justify-center rounded-2xl px-3 py-2.5 text-center text-sm font-extrabold tracking-tight transition ${r.className}`}
            >
              {r.label}
            </a>
          ))}
        </div>
      )}

      {showPrimary && showQuick && (
        <div className="relative my-3 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-muted">
            Quick apps
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      )}

      {(showQuick || onlyQuick) && (
        <div className="relative">
          {onlyQuick && (
            <p className="mb-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Pick a store
            </p>
          )}
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {(onlyQuick ? resolved : quick).map((r) => (
              <a
                key={r.id}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`snap-start shrink-0 rounded-2xl px-3.5 py-2 text-center text-[11px] font-extrabold leading-none tracking-tight transition ${r.className}`}
              >
                {r.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
