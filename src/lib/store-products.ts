import type { RetailerLinks } from "@/components/product-retailers";
import { prisma } from "@/lib/prisma";

export type StorefrontProduct = {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  price: string;
  tag: string;
  imageUrl: string | null;
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
      imageUrl: r.imageUrl,
      retailers: parseRetailers(r.retailers),
    }));
  } catch {
    return [];
  }
}
