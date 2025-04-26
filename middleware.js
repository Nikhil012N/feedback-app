import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("user-role")?.value;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    if (role) {
      try {
        const redirectPath = role === "admin" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } catch {
        const response = NextResponse.next();
        response.cookies.delete("token");
        response.cookies.delete("user-role");
        return response;
      }
    }
    return NextResponse.next();
  }

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard") && role !== "user") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);

    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
