import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  try {
    const [posts, products] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: "published" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
    return [
      { url: base, lastModified: new Date() },
      { url: `${base}/blog`, lastModified: new Date() },
      { url: `${base}/products`, lastModified: new Date() },
      ...products.map((p) => ({
        url: `${base}/products/${p.slug}`,
        lastModified: p.updatedAt,
      })),
      ...posts.map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.updatedAt,
      })),
    ];
  } catch {
    return [
      { url: base, lastModified: new Date() },
      { url: `${base}/blog`, lastModified: new Date() },
      { url: `${base}/products`, lastModified: new Date() },
    ];
  }
}
