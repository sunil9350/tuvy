import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const items = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = String(body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
    const slug = String(body.slug ?? "").trim() || slugify(title);
    const contentHtml = String(body.contentHtml ?? "");
    const excerpt = body.excerpt != null ? String(body.excerpt).trim() || null : null;
    const status = String(body.status ?? "draft") === "published" ? "published" : "draft";
    const metaTitle = body.metaTitle != null ? String(body.metaTitle).trim() || null : null;
    const metaDescription =
      body.metaDescription != null ? String(body.metaDescription).trim() || null : null;
    const ogImageUrl = body.ogImageUrl != null ? String(body.ogImageUrl).trim() || null : null;
    const publishedAt =
      status === "published"
        ? body.publishedAt
          ? new Date(String(body.publishedAt))
          : new Date()
        : null;

    const created = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        contentHtml,
        status,
        publishedAt,
        metaTitle,
        metaDescription,
        ogImageUrl,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Create failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
