import Link from "next/link";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <Link href="/admin/blog" className="text-sm font-bold text-brand hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">New post</h1>
      <p className="mt-1 text-sm font-medium text-muted">
        Use the toolbar for bold, headings, lists, and links—similar to the WordPress block editor.
      </p>
      <div className="mt-8 max-w-3xl">
        <BlogPostForm mode="create" />
      </div>
    </div>
  );
}
