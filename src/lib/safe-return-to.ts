/**
 * Open-redirect hardening: only same-origin relative paths are allowed.
 */
export function safeReturnToParam(next: string | undefined, fallback: string = "/"): string {
  if (!next?.trim()) return fallback;
  const t = next.trim();
  if (t.startsWith("//") || t.includes("://")) return fallback;
  if (!t.startsWith("/")) return fallback;
  return t;
}
