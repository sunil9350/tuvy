export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return raw && raw.length > 0 ? raw : "http://localhost:3000";
}
