import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all public routes to pass through
  const publicRoutes = ['/', '/work', '/studystream', '/jagex', '/contact', '/signal-engine']

  // If the path is a public route or starts with /api, /_next, or is a static file, allow it
  if (
    publicRoutes.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/assets') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // For /admin routes, just pass through (auth will be handled in the layout)
  // This prevents middleware from trying to initialize Supabase
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
