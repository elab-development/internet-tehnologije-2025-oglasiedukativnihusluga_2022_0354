import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next(); //idemo dalje na sledeci handler

  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'http://localhost:3000');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Security headers 
  response.headers.set('X-Content-Type-Options', 'nosniff');  //znamo tacno vrstu fajla
  response.headers.set('X-Frame-Options', 'DENY'); //clickjacking
  response.headers.set('X-XSS-Protection', '1; mode=block'); //blokiranje zlonamernog JS
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); //curenje url infa

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
