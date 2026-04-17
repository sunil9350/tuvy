import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tuvy Blog — tips, hacks, and kitchen wins",
  description:
    "Guides and stories from Tuvy: tidy utility for faster weeknight cooking.",
  openGraph: {
    title: "Tuvy Blog",
    description: "Guides and stories from Tuvy.",
  },
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Blog
      </h1>
      <p className="mt-2 text-base font-medium text-muted">
        Practical ideas for calmer kitchens and faster weeknight cooking.
      </p>
      <ul className="mt-10 space-y-6">
        {posts.map((p: any) => (
          <li key={p.slug}>
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-black/[0.03] transition hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                {(p.publishedAt ?? p.updatedAt).toISOString().slice(0, 10)}
              </p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight">
                <Link href={`/blog/${p.slug}`} className="hover:text-brand">
                  {p.title}
                </Link>
              </h2>
              {p.excerpt ? (
                <p className="mt-2 text-sm font-medium text-muted">
                  {p.excerpt}
                </p>
              ) : null}
              <Link
                href={`/blog/${p.slug}`}
                className="mt-4 inline-flex text-sm font-extrabold text-brand hover:underline"
              >
                Read more →
              </Link>
            </article>
          </li>
        ))}
      </ul>
      {posts.length === 0 ? (
        <p className="mt-10 text-sm font-medium text-muted">
          New posts are on the way. Check back soon.
        </p>
      ) : null}
    </main>
  );
}
