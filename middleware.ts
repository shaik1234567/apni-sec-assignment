import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];
  const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/health'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
  
  // If it's a public route, allow access
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, check for authentication token
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // If no token is found, redirect to login for page routes or return 401 for API routes
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|logo.svg|hero-bg.png|og-image.png).*)',
  ],
};