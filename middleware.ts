// middleware.ts

import { NextRequest, NextResponse } from "next/server"

export default function middleware(req: NextRequest, res: NextResponse) {
  const { pathname, origin } = req.nextUrl
  const token = req.cookies.get(
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"
  )?.value
  // Redirect based on authentication status
  const isAuthPage = ["/sign-in", "/sign-up"].includes(pathname)
  const isAuthenticated = !!token

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", origin))
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", origin))
  }
}

// Configuration to match specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
