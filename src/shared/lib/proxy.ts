import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/^\/goal\/\d+\/note\/create$/.test(pathname)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete('next-url');
    return NextResponse.rewrite(request.nextUrl, {
      request: { headers: requestHeaders },
    });
  }
}
