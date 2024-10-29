// middleware.ts

import { NextRequest, NextResponse } from "next/server"

export default function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  // Get the authentication token from cookies
  const token = req.cookies.get(
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"
  )?.value

  const isAuthenticated = !!token

  // Define the paths that require authentication
  const isProtected = ["/profile", "/watchlist"].includes(pathname)
  const isAuthPage = ["/sign-in", "/sign-up"].includes(pathname)

  // If the user is not authenticated and tries to access protected pages, redirect to login
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", origin))
  }

  // If the user is authenticated, prevent access to auth pages (sign-in, sign-up)
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", origin))
  }

  // Allow the request if none of the above conditions match
  return NextResponse.next()
}

// Configuration to match specific paths
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Match all except the specified paths
  ],
}
