import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g. images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

export default function middleware(req) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers.get('host') || '';

  // Remove port if present (for local development)
  hostname = hostname.split(':')[0];

  // Define allowed root domains (update these with your actual domains later)
  const allowedRootDomains = ['localhost', 'nfour.com', 'nfour-eshop.vercel.app'];

  // Check if it's the root domain or admin route
  const isRootDomain = allowedRootDomains.includes(hostname);
  
  // Also pass through if we are explicitly accessing /admin or /api
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // If it's a root domain, Next.js handles routing automatically based on folder structure.
  if (isRootDomain) {
    return NextResponse.next();
  }

  // If it's a subdomain or custom domain, rewrite to the dynamic [domain] folder
  // e.g. store1.localhost:3000 -> /store1/
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url));
}
