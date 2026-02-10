import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

const PROTECTED_PATHS = ["/inbox", "/today", "/week", "/done"];

const isProtectedPath = (pathname: string) =>
  PROTECTED_PATHS.some((path) => pathname.startsWith(path));

const getSafeNext = (pathname: string, search: string) =>
  `${pathname}${search}`.startsWith("/") ? `${pathname}${search}` : "/inbox";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  const { supabase, response } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", getSafeNext(pathname, search));
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
