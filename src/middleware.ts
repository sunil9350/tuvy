import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth0, isAuth0Configured } from "@/lib/auth0";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/auth-session";

export async function middleware(request: NextRequest) {
  if (!isAuth0Configured()) {
    const { pathname } = request.nextUrl;

    if (pathname === "/auth/login" || pathname === "/auth/callback" || pathname === "/auth/logout") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.search = "";
      url.searchParams.set("e", "auth0_not_config");
      return NextResponse.redirect(url);
    }

    if (pathname !== "/auth/signin" && pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/auth/signin?e=auth0_not_config", request.url));
    }

    if (pathname.startsWith("/admin/login") || pathname === "/api/admin/login") {
      return NextResponse.next();
    }
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      const token = request.cookies.get(ADMIN_COOKIE)?.value;
      const ok = await verifyAdminSession(token);
      if (!ok) {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  const authResponse = await getAuth0().middleware(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth")) {
    return authResponse;
  }
  if (pathname.startsWith("/admin/login") || pathname === "/api/admin/login") {
    return authResponse;
  }
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const ok = await verifyAdminSession(token);
    if (!ok) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return authResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$).*)",
  ],
};
