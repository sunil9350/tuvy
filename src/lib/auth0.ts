import { Auth0Client } from "@auth0/nextjs-auth0/server";

const appBase =
  process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

let auth0Singleton: Auth0Client | null = null;

/**
 * Strips a pasted issuer URL to the hostname the SDK expects (e.g. no `https://`).
 * Wrong formatting is a common cause of DomainResolutionError.
 */
function normalizeAuth0Domain(raw: string | undefined): string {
  if (!raw?.trim()) return "";
  return raw
    .trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0]!
    .toLowerCase();
}

/**
 * Auth0 v4 can throw DomainResolutionError in middleware if the tenant domain is
 * missing, empty, or not set when the SDK infers/loads metadata.
 */
export function isAuth0Configured(): boolean {
  if (typeof process.env.AUTH0_SECRET !== "string" || process.env.AUTH0_SECRET.length < 32) {
    return false;
  }
  if (!normalizeAuth0Domain(process.env.AUTH0_DOMAIN)) return false;
  if (!process.env.AUTH0_CLIENT_ID?.trim()) return false;
  if (!process.env.AUTH0_CLIENT_SECRET) return false;
  return true;
}

/**
 * Shared Auth0 (Google) client. Do not use until `isAuth0Configured()` is true
 * (e.g. from middleware / server after checking).
 */
export function getAuth0(): Auth0Client {
  if (!isAuth0Configured()) {
    throw new Error(
      "Auth0 is not configured. Set AUTH0_DOMAIN (hostname only, e.g. your-tenant.auth0.com), AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET (≥32 bytes), and APP_BASE_URL. See .env.example.",
    );
  }
  if (auth0Singleton) return auth0Singleton;

  const domain = normalizeAuth0Domain(process.env.AUTH0_DOMAIN);

  auth0Singleton = new Auth0Client({
    domain,
    appBaseUrl: appBase,
    authorizationParameters: {
      scope: "openid profile email",
    },
    session: {
      rolling: true,
      absoluteDuration: 60 * 60 * 24 * 30, // 30d
      inactivityDuration: 60 * 60 * 24 * 7, // 7d
    },
    enableAccessTokenEndpoint: false,
  });

  return auth0Singleton;
}
