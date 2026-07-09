import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies or you can check localStorage on client-side
  const token = request.cookies.get('adminToken')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Root path
  const isRootPath = pathname === '/';

  // If trying to access root, redirect to dashboard if authenticated, login if not
  if (isRootPath) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing login page and already authenticated, redirect to dashboard
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing protected route without token, redirect to login
  // Note: Since we're using localStorage for token, this middleware won't catch it
  // The client-side auth check in layout.tsx will handle it
  if (!isPublicRoute && !token) {
    // Allow the request to proceed, client-side auth will handle redirect
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
