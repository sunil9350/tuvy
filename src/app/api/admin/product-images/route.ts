import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per file
const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
]);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const files = form.getAll("file").filter((x): x is File => x instanceof File);
    if (files.length === 0) {
      return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const dir = join(process.cwd(), "public", "uploads", "products");
    await mkdir(dir, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
      if (!file.size) continue;
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB)` }, { status: 400 });
      }
      const ext = ALLOWED.get(file.type);
      if (!ext) {
        return NextResponse.json(
          { error: `Unsupported type: ${file.type || "unknown"}` },
          { status: 400 },
        );
      }
      const buf = Buffer.from(await file.arrayBuffer());
      const name = `${randomUUID()}${ext}`;
      const full = join(dir, name);
      await writeFile(full, buf);
      urls.push(`/uploads/products/${name}`);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "No valid files" }, { status: 400 });
    }
    return NextResponse.json({ urls });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
