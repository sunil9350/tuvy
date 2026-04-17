import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/blog-post-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const initial = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    contentHtml: post.contentHtml || "<p></p>",
    status: post.status === "published" ? "published" as const : "draft" as const,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    ogImageUrl: post.ogImageUrl ?? "",
  };

  return (
    <div>
      <Link href="/admin/blog" className="text-sm font-bold text-brand hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Edit post</h1>
      <p className="mt-1 font-mono text-xs text-muted">{post.slug}</p>
      <div className="mt-8 max-w-3xl">
        <BlogPostForm key={post.id} mode="edit" initial={initial} />
      </div>
    </div>
  );
}
