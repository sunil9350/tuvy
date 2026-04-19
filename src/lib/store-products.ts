import type { RetailerLinks } from "@/components/product-retailers";
import { prisma } from "@/lib/prisma";
import { parseProductImages } from "@/lib/product-images";

export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  price: string;
  tag: string;
  images: string[];
  retailers: RetailerLinks;
};

function parseRetailers(raw: string): RetailerLinks {
  try {
    return JSON.parse(raw) as RetailerLinks;
  } catch {
    return {};
  }
}

export async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  try {
    const rows = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      blurb: r.blurb,
      price: r.price,
      tag: r.tag,
      images: parseProductImages(r.images),
      retailers: parseRetailers(r.retailers),
    }));
  } catch {
    return [];
  }
}

export async function getStorefrontProductBySlug(
  slug: string,
): Promise<StorefrontProduct | null> {
  try {
    const r = await prisma.product.findUnique({ where: { slug } });
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      blurb: r.blurb,
      price: r.price,
      tag: r.tag,
      images: parseProductImages(r.images),
      retailers: parseRetailers(r.retailers),
    };
  } catch {
    return null;
  }
}
