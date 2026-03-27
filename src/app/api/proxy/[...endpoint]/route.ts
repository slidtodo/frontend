import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const apiBaseUrl = (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const FORWARDED_REQUEST_HEADERS = ['accept', 'content-type'] as const;
const FORWARDED_RESPONSE_HEADERS = ['content-type', 'location'] as const;

type ProxyRouteContext = {
  params: Promise<{ endpoint: string[] }>;
};

const syncAuthCookies = async (pathname: string, response: Response, nextResponse: NextResponse) => {
  if (!response.ok) {
    return;
  }

  if (pathname === 'auth/logout') {
    nextResponse.cookies.delete('accessToken');
    nextResponse.cookies.delete('refreshToken');
    return;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return;
  }

  try {
    const data = (await response.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };

    if (data.accessToken) {
      nextResponse.cookies.set('accessToken', data.accessToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 60 * 14,
      });
    }

    if (data.refreshToken) {
      nextResponse.cookies.set('refreshToken', data.refreshToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 60 * 59,
      });
    }
  } catch {
    // Ignore unexpected non-JSON auth responses.
  }
};

const handler = async (request: NextRequest, context: ProxyRouteContext) => {
  if (!apiBaseUrl) {
    return NextResponse.json({ message: 'API_BASE_URL is not defined in environment variables' }, { status: 500 });
  }

  const { endpoint } = await context.params;
  const pathname = endpoint.join('/');
  const targetUrl = `${apiBaseUrl}/api/v1/${pathname}${request.nextUrl.search}`;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const upstreamHeaders = new Headers();
  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const headerValue = request.headers.get(headerName);
    if (headerValue) {
      upstreamHeaders.set(headerName, headerValue);
    }
  }

  if (accessToken) {
    upstreamHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: upstreamHeaders,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
    cache: 'no-store',
  });
  const authResponse = response.clone();

  const responseHeaders = new Headers();
  for (const headerName of FORWARDED_RESPONSE_HEADERS) {
    const headerValue = response.headers.get(headerName);
    if (headerValue) {
      responseHeaders.set(headerName, headerValue);
    }
  }

  const nextResponse = new NextResponse(response.status === 204 ? null : await response.arrayBuffer(), {
    status: response.status,
    headers: responseHeaders,
  });

  await syncAuthCookies(pathname, authResponse, nextResponse);

  return nextResponse;
};

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
