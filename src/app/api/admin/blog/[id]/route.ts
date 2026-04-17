import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = await prisma.blogPost.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = body.title !== undefined ? String(body.title).trim() : existing.title;
    const slug =
      body.slug !== undefined ? String(body.slug).trim() || slugify(title) : existing.slug;
    const excerpt =
      body.excerpt !== undefined ? String(body.excerpt).trim() || null : existing.excerpt;
    const contentHtml =
      body.contentHtml !== undefined ? String(body.contentHtml) : existing.contentHtml;
    const metaTitle =
      body.metaTitle !== undefined ? String(body.metaTitle).trim() || null : existing.metaTitle;
    const metaDescription =
      body.metaDescription !== undefined
        ? String(body.metaDescription).trim() || null
        : existing.metaDescription;
    const ogImageUrl =
      body.ogImageUrl !== undefined ? String(body.ogImageUrl).trim() || null : existing.ogImageUrl;

    const nextStatus =
      body.status !== undefined
        ? String(body.status) === "published"
          ? "published"
          : "draft"
        : existing.status;

    let publishedAt = existing.publishedAt;
    if (nextStatus === "draft") {
      publishedAt = null;
    } else if (nextStatus === "published") {
      if (body.publishedAt !== undefined) {
        const raw = String(body.publishedAt).trim();
        publishedAt = raw ? new Date(raw) : new Date();
      } else if (!existing.publishedAt) {
        publishedAt = new Date();
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        contentHtml,
        metaTitle,
        metaDescription,
        ogImageUrl,
        status: nextStatus,
        publishedAt,
      },
    });
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
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
