import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });
    return [
      { url: base, lastModified: new Date() },
      { url: `${base}/blog`, lastModified: new Date() },
      ...posts.map((p: any) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.updatedAt,
      })),
    ];
  } catch {
    return [
      { url: base, lastModified: new Date() },
      { url: `${base}/blog`, lastModified: new Date() },
    ];
  }
}
