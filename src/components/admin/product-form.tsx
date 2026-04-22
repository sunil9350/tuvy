"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Initial = {
  name: string;
  slug: string;
  blurb: string;
  price: string;
  tag: string;
  images: string[];
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
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [images, setImages] = useState<string[]>(() =>
    initial?.images?.length ? [...initial.images] : [""],
  );
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [retailersJson, setRetailersJson] = useState(
    initial?.retailersJson ?? defaultRetailersJson ?? "{}",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function addImageRow() {
    setImages((s) => [...s, ""]);
  }

  function updateImageRow(i: number, v: string) {
    setImages((s) => s.map((x, j) => (j === i ? v : x)));
  }

  function removeImageRow(i: number) {
    setImages((s) => (s.length <= 1 ? [""] : s.filter((_, j) => j !== i)));
  }

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      for (const f of files) fd.append("file", f);
      const res = await fetch("/api/admin/product-images", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        urls?: string[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      const urls = data.urls ?? [];
      if (urls.length === 0) {
        setError("No files saved");
        return;
      }
      setImages((s) => {
        const trimmed = s.map((x) => x.trim()).filter(Boolean);
        return [...trimmed, ...urls, ""];
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

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
    const imageList = images.map((s) => s.trim()).filter(Boolean);
    setLoading(true);
    try {
      const payload = {
        name,
        slug: slug.trim() || undefined,
        blurb,
        price,
        tag,
        images: imageList,
        sortOrder: Number(sortOrder) || 0,
        retailers,
      };
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${productId}`;
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
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
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
  const fieldInline =
    "w-full flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition focus:ring-4 focus:ring-brand/15";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Name
          </span>
          <input
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Slug
          </span>
          <input
            className={field}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Sort order
          </span>
          <input
            className={field}
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Price
          </span>
          <input
            className={field}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Badge
          </span>
          <input
            className={field}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
          />
        </label>

        <div className="block sm:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Product images
          </span>
          <p className="mt-1 text-xs font-medium text-muted">
            Add multiple URLs (CDN) or upload files — order is left-to-right in
            the storefront gallery. Uploads are saved under{" "}
            <code className="rounded bg-background px-1">
              /public/uploads/products/
            </code>{" "}
            (fine for local/self-hosted; use a blob/S3 URL in production if you
            deploy serverless).
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loading || uploading}
              className="rounded-2xl border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition hover:bg-background disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload images"}
            </button>
            <button
              type="button"
              onClick={addImageRow}
              disabled={loading}
              className="rounded-2xl border border-dashed border-brand/40 bg-brand/[0.04] px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand/10 disabled:opacity-50"
            >
              + Image URL row
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              multiple
              className="hidden"
              onChange={onPickFiles}
            />
          </div>
          <ul className="mt-3 space-y-2">
            {images.map((row, i) => (
              <li key={i} className="flex gap-2">
                <input
                  className={fieldInline}
                  value={row}
                  onChange={(e) => updateImageRow(i, e.target.value)}
                  placeholder="https://… or path after upload"
                  aria-label={`Image URL ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeImageRow(i)}
                  disabled={loading}
                  className="mt-0 shrink-0 rounded-2xl border border-border px-3 py-2 text-xs font-extrabold text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <label className="block sm:col-span-2">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Blurb
          </span>
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
          disabled={loading || uploading}
          className="rounded-2xl bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-hover disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Saving…" : "Save product"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={remove}
            disabled={loading}
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-extrabold text-red-700 transition hover:bg-red-100 disabled:opacity-60 cursor-pointer"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
