import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm font-medium text-muted">
            WordPress-style editor with SEO fields. Published posts appear on{" "}
            <Link className="font-bold text-brand hover:underline" href="/blog">
              /blog
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-4 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-hover"
        >
          New post
        </Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.03]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background/80 text-xs font-extrabold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="hidden px-4 py-3 md:table-cell">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 lg:table-cell">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-border/80 last:border-0">
                <td className="px-4 py-3 font-bold">{p.title}</td>
                <td className="hidden px-4 py-3 font-mono text-xs text-muted md:table-cell">{p.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                      p.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted lg:table-cell">
                  {p.updatedAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/blog/${p.id}/edit`}
                    className="font-bold text-brand hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm font-medium text-muted">No posts yet.</p>
        ) : null}
      </div>
    </div>
  );
}
