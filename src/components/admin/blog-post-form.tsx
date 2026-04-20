"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BlogEditor } from "@/components/admin/blog-editor";
import { slugify } from "@/lib/slug";

type Mode = "create" | "edit";

type Initial = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  status: "draft" | "published";
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

export function BlogPostForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: Initial;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(
    initial?.contentHtml ?? "<p></p>",
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initial?.status ?? "draft",
  );
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription ?? "",
  );
  const [ogImageUrl, setOgImageUrl] = useState(initial?.ogImageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const autoSlugPreview = useMemo(() => slugify(title), [title]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        title,
        slug: slug.trim() || autoSlugPreview,
        excerpt,
        contentHtml,
        status,
        metaTitle: metaTitle.trim() || null,
        metaDescription: metaDescription.trim() || null,
        ogImageUrl: ogImageUrl.trim() || null,
      };
      const url =
        mode === "create"
          ? "/api/admin/blog"
          : `/api/admin/blog/${initial?.id}`;
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
      router.push("/admin/blog");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (mode !== "edit" || !initial?.id) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${initial.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Delete failed");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const field =
    "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium outline-none transition focus:ring-4 focus:ring-brand/15";

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted">
          Content
        </h2>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Title
          </span>
          <input
            className={field}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <p className="mt-1 text-xs font-medium text-muted">
            Leave blank to auto-generate:{" "}
            <span className="font-mono">{autoSlugPreview || "…"}</span>
          </p>
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Excerpt
          </span>
          <textarea
            className={`${field} min-h-[72px]`}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </label>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Body
          </span>
          <div className="mt-2">
            <BlogEditor
              initialHtml={contentHtml}
              onChangeHtml={setContentHtml}
            />
          </div>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={status === "published"}
            onChange={(e) =>
              setStatus(e.target.checked ? "published" : "draft")
            }
            className="size-4 rounded border-border text-brand focus:ring-brand/40"
          />
          Published (visible on /blog)
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background/60 p-5 ring-1 ring-black/[0.02]">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-brand">
          SEO
        </h2>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Meta title
          </span>
          <input
            className={field}
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Overrides the HTML title when set"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Meta description
          </span>
          <textarea
            className={`${field} min-h-[88px]`}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Shown in Google snippets and Open Graph"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
            Open Graph image URL
          </span>
          <input
            className={field}
            value={ogImageUrl}
            onChange={(e) => setOgImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </label>
      </section>

      {error ? (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-hover disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Saving…" : "Save post"}
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
