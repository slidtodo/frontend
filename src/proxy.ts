import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { refreshTokens, clearAuthCookies, applyAuthCookies } from '@/shared/lib/auth/token';

export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  if (isDashboard && !accessToken && !refreshToken) {
    return redirectToLogin(request);
  }

  const isLogin = request.nextUrl.pathname === '/login';
  const isSignup = request.nextUrl.pathname === '/signup';
  if ((isLogin || isSignup) && accessToken && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const { isAccessTokenValid, isRefreshTokenValid } = isValidToken({
    accessToken,
    refreshToken,
  });

  if (!isRefreshTokenValid) {
    const response = isDashboard ? redirectToLogin(request) : NextResponse.next();
    clearAuthCookies(response);
    return response;
  }

  if (!isAccessTokenValid && refreshToken) {
    const refreshedTokens = await refreshTokens(refreshToken);
    if (!refreshedTokens?.accessToken) {
      const response = redirectToLogin(request);
      clearAuthCookies(response);
      return response;
    }

    const response =
      isLogin || isSignup ? NextResponse.redirect(new URL('/dashboard', request.url)) : NextResponse.next();
    applyAuthCookies(response, refreshedTokens);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};

function isValidToken(tokens: { accessToken?: string; refreshToken?: string }) {
  const isTokenExpired = (token?: string) => {
    if (!token) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };
  const isAccessTokenValid = !isTokenExpired(tokens.accessToken);
  const isRefreshTokenValid = !isTokenExpired(tokens.refreshToken);
  return { isAccessTokenValid, isRefreshTokenValid };
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}
