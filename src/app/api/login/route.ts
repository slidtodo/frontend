import { NextResponse } from 'next/server';

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

const readCookieValue = (setCookieHeader: string, cookieName: string) => {
  const match = setCookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
  return match?.[1];
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const setCookieHeader = response.headers.get('set-cookie') ?? '';
  const accessToken = readCookieValue(setCookieHeader, 'accessToken');
  const refreshToken = readCookieValue(setCookieHeader, 'refreshToken');

  console.log('accessToken', accessToken);
  const nextResponse = NextResponse.json({ ok: true });

  if (accessToken) {
    nextResponse.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 14, // 임시적으로 14분으로 설정 (accessToken의 유효기간에 맞춰 조정 필요)
    });
  }
  if (refreshToken) {
    nextResponse.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 59,
    });
  }

  return nextResponse;
}
