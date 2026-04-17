"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Initial = {
  name: string;
  slug: string;
  blurb: string;
  price: string;
  tag: string;
  imageUrl: string;
  sortOrder: number;
  retailersJson: string;
};

export function ProductForm({
  mode,
  productId,
  initial,
  defaultRetailersJson,
}: {
  mode: "create" | "edit";
  productId?: string;
  initial?: Initial;
  defaultRetailersJson?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [retailersJson, setRetailersJson] = useState(
    initial?.retailersJson ?? defaultRetailersJson ?? "{}",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    let retailers: unknown = retailersJson;
    try {
      retailers = JSON.parse(retailersJson);
    } catch {
      setError("Retailers must be valid JSON.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name,
        slug: slug.trim() || undefined,
        blurb,
        price,
        tag,
        imageUrl: imageUrl.trim() || null,
        sortOrder: Number(sortOrder) || 0,
        retailers,
      };
      const url =
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (mode !== "edit" || !productId) return;
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Delete failed");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const field =
    "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition focus:ring-4 focus:ring-brand/15";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Name</span>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Slug</span>
          <input className={field} value={slug} onChange={(e) => setSlug(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Sort order</span>
          <input
            className={field}
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Price</span>
          <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Badge</span>
          <input className={field} value={tag} onChange={(e) => setTag(e.target.value)} required />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Image URL</span>
          <input className={field} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Blurb</span>
          <textarea
            className={`${field} min-h-[88px]`}
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            required
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Retailer links (JSON)
          </span>
          <textarea
            className={`${field} min-h-[200px] font-mono text-xs leading-relaxed`}
            value={retailersJson}
            onChange={(e) => setRetailersJson(e.target.value)}
            spellCheck={false}
            required
          />
        </label>
      </div>
      {error ? (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-hover disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save product"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={remove}
            disabled={loading}
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-extrabold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
