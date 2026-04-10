import { NextRequest, NextResponse } from 'next/server';
import { proxy } from './shared/lib/proxy';

export function middleware(request: NextRequest) {
  return proxy(request) ?? NextResponse.next();
}

export const config = {
  matcher: ['/goal/:path*/note/create'],
};
