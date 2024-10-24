// middleware.ts

import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log the incoming request URL

  // Get the current page parameter from the request URL, defaulting to "1"
  const currentPage = request.nextUrl.searchParams.get("page") ?? "1"

  // Set a custom header with the current page value
  const response = NextResponse.next()
  // response.headers.set("page", currentPage)
  // response.headers.set("currentUrl", request.nextUrl.pathname)

  return response
}

// Configuration for matching specific paths
export const config = {
  matcher: "/about/:path*", // This will match all paths under /movie
}
