import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/api/auth/login', '/api/auth/signup']
const PROTECTED_ROUTES = ['/dashboard', '/assessments', '/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public API routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  if (isProtectedRoute) {
    // In a real app, you'd check the session here
    // For now, allow access - the client-side auth check will handle it
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
