import { NextResponse, type NextRequest } from "next/server";

/**
 * Protection de /admin-demo par un code d'accès (cookie httpOnly).
 * Suffisant pour une démonstration — à remplacer par une vraie
 * authentification (NextAuth/Auth.js, Clerk, Supabase Auth…) en production.
 */
const ADMIN_COOKIE = "samyo_admin";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin-demo/login")) return NextResponse.next();
  if (req.cookies.get(ADMIN_COOKIE)?.value === "1") return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/admin-demo/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin-demo/:path*"] };
