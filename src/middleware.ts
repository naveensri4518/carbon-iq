import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = ["/dashboard", "/advisor", "/simulator", "/passport"].some((route) => path.startsWith(route));
  
  if (isProtectedRoute) {
    const session = request.cookies.get("session")?.value;
    
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await decrypt(session);
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  // Also redirect logged in users away from /login
  if (path === "/login" || path === "/register") {
    const session = request.cookies.get("session")?.value;
    if (session) {
      try {
        await decrypt(session);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (e) {}
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
