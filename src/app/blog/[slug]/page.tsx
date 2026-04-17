import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "published" },
  });
  if (!post) return { title: "Post not found" };

  const site = getSiteUrl();
  const title = post.metaTitle?.trim() || post.title;
  const description = post.metaDescription?.trim() || post.excerpt || `Read “${post.title}” on the Tuvy blog.`;
  const url = `${site}/blog/${post.slug}`;

  return {
    title: `${title} | Tuvy Blog`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.ogImageUrl ? [{ url: post.ogImageUrl }] : undefined,
    },
    twitter: {
      card: post.ogImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: post.ogImageUrl ? [post.ogImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "published" },
  });
  if (!post) notFound();

  const site = getSiteUrl();
  const url = `${site}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: post.ogImageUrl || undefined,
    author: { "@type": "Organization", name: "Tuvy" },
    publisher: { "@type": "Organization", name: "Tuvy" },
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="text-sm font-bold text-brand hover:underline">
        ← All posts
      </Link>
      <article className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-muted">
          {(post.publishedAt ?? post.updatedAt).toISOString().slice(0, 10)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg font-medium text-muted">{post.excerpt}</p> : null}
        <div
          className="blog-body mt-10 text-base leading-relaxed text-foreground [&_a]:text-brand [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-brand/25 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}
