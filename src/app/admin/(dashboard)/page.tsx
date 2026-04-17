import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [productCount, postCount, publishedCount] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "published" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm font-medium text-muted">Manage catalog listings and SEO-friendly blog posts.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-black/[0.03]">
          <p className="text-xs font-extrabold uppercase tracking-wide text-muted">Products</p>
          <p className="mt-2 text-3xl font-extrabold">{productCount}</p>
          <Link href="/admin/products" className="mt-3 inline-block text-sm font-bold text-brand hover:underline">
            Manage →
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-black/[0.03]">
          <p className="text-xs font-extrabold uppercase tracking-wide text-muted">Blog posts</p>
          <p className="mt-2 text-3xl font-extrabold">{postCount}</p>
          <p className="mt-1 text-xs font-medium text-muted">{publishedCount} published</p>
          <Link href="/admin/blog" className="mt-3 inline-block text-sm font-bold text-brand hover:underline">
            Manage →
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-black/[0.03]">
          <p className="text-xs font-extrabold uppercase tracking-wide text-muted">SEO</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
            Public posts live at <span className="font-mono text-xs">/blog/[slug]</span> with metadata + JSON-LD.
          </p>
          <Link href="/blog" className="mt-3 inline-block text-sm font-bold text-brand hover:underline">
            Open blog →
          </Link>
        </div>
      </div>
    </div>
  );
}
