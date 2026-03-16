import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const protectedPrefixes = ['/dashboard', '/admin', '/calendar', '/certificates', '/cis', '/customers', '/engineers', '/fleet', '/invoices', '/jobs', '/map', '/mobile', '/more', '/quotes', '/reports', '/revenue', '/scheduling', '/settings', '/stock', '/branches', '/portal'];

const publicPaths = ['/', '/login', '/features', '/pricing', '/case-studies', '/about', '/contact', '/compliance', '/comparison', '/privacy', '/terms', '/v2', '/pay', '/api'];

function isProtected(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}

function isPublic(pathname: string) {
  return publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public paths, static files, and API routes
  if (
    isPublic(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Protected routes require auth
  if (isProtected(pathname) && !req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-|sw.js|workbox-).*)'],
};
