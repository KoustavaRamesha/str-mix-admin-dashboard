import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';

export function middleware(request: NextRequest) {
  // Generate a unique nonce for this request
  const nonce = crypto.randomBytes(16).toString('base64');
  
  // Clone the request headers and add the nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Clone the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add CSP header with nonce
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ujgolmqhsapzksdwzbxn.supabase.co';
  const supabaseHostname = new URL(supabaseUrl).hostname;

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://apis.google.com https://cdn.jsdelivr.net`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https: http:",
    `connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://${supabaseHostname} wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com",
    "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};
