import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseImagesFromBody } from "@/lib/product-images";
import { slugify } from "@/lib/slug";

function parseRetailers(input: unknown): string | undefined {
  if (input === undefined) return undefined;
  if (typeof input === "string") {
    const t = input.trim();
    if (!t) return "{}";
    JSON.parse(t);
    return t;
  }
  if (input && typeof input === "object") {
    return JSON.stringify(input);
  }
  throw new Error("retailers must be JSON object or string");
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = await prisma.product.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = body.name !== undefined ? String(body.name).trim() : existing.name;
    const slug =
      body.slug !== undefined ? String(body.slug).trim() || slugify(name) : existing.slug;
    const blurb = body.blurb !== undefined ? String(body.blurb).trim() : existing.blurb;
    const price = body.price !== undefined ? String(body.price).trim() : existing.price;
    const tag = body.tag !== undefined ? String(body.tag).trim() : existing.tag;
    const images =
      body.images !== undefined ? parseImagesFromBody(body.images) : existing.images;
    const sortOrder =
      body.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder))
        ? Number(body.sortOrder)
        : existing.sortOrder;
    const retailers =
      body.retailers !== undefined ? parseRetailers(body.retailers) : existing.retailers;

    const updated = await prisma.product.update({
      where: { id },
      data: { name, slug, blurb, price, tag, images, sortOrder, retailers },
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${existing.slug}`);
    revalidatePath(`/products/${updated.slug}`);
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Update failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    const row = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/products");
    if (row?.slug) revalidatePath(`/products/${row.slug}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
