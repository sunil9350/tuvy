import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

function parseRetailers(input: unknown): string {
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

export async function GET() {
  const items = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
    const slug = String(body.slug ?? "").trim() || slugify(name);
    const blurb = String(body.blurb ?? "").trim();
    const price = String(body.price ?? "").trim();
    const tag = String(body.tag ?? "").trim();
    if (!blurb || !price || !tag) {
      return NextResponse.json({ error: "blurb, price, tag are required" }, { status: 400 });
    }
    const imageUrl = body.imageUrl ? String(body.imageUrl).trim() || null : null;
    const sortOrder = Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0;
    const retailers = parseRetailers(body.retailers ?? "{}");

    const created = await prisma.product.create({
      data: { name, slug, blurb, price, tag, imageUrl, sortOrder, retailers },
    });
    revalidatePath("/");
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Create failed";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
