const MAX_IMAGES = 24;

/** Parse DB JSON column into ordered image URLs. */
export function parseProductImages(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_IMAGES);
  } catch {
    return [];
  }
}

export function stringifyProductImages(urls: string[]): string {
  const cleaned = urls.map((s) => s.trim()).filter(Boolean).slice(0, MAX_IMAGES);
  return JSON.stringify(cleaned);
}

/** Normalize API body input into JSON string for Prisma. */
export function parseImagesFromBody(input: unknown): string {
  if (input === undefined || input === null) return "[]";
  let list: string[] = [];
  if (Array.isArray(input)) {
    list = input.map((x) => String(x).trim()).filter(Boolean);
  } else if (typeof input === "string") {
    const t = input.trim();
    if (!t) return "[]";
    try {
      const v = JSON.parse(t) as unknown;
      if (Array.isArray(v)) list = v.map((x) => String(x).trim()).filter(Boolean);
      else if (t) list = [t];
    } catch {
      list = [t];
    }
  }
  return stringifyProductImages(list);
}
