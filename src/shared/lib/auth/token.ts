import { NextResponse } from 'next/server';

const apiBaseUrl = (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

export async function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `refreshToken=${refreshToken}`,
    },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  try {
    return (await response.json()) as AuthTokens;
  } catch {
    return null;
  }
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
}

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
export function applyAuthCookies(response: NextResponse, tokens: AuthTokens) {
  if (tokens.accessToken) {
    response.cookies.set('accessToken', tokens.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 60 * 30,
    });
  }

  if (tokens.refreshToken) {
    response.cookies.set('refreshToken', tokens.refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}
