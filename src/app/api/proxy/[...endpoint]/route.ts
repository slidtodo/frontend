import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { refreshTokens, clearAuthCookies, applyAuthCookies, type AuthTokens } from '@/shared/lib/auth/token';

const apiBaseUrl = (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

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
    clearAuthCookies(nextResponse);
    return;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return;
  }

  try {
    const data = (await response.json()) as AuthTokens;
    applyAuthCookies(nextResponse, data);
  } catch {
    // Ignore unexpected non-JSON auth responses.
  }
};

const buildUpstreamHeaders = (request: NextRequest, accessToken?: string) => {
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

  return upstreamHeaders;
};

const fetchUpstream = async (
  targetUrl: string,
  request: NextRequest,
  requestBody: string | undefined,
  accessToken?: string,
) =>
  fetch(targetUrl, {
    method: request.method,
    headers: buildUpstreamHeaders(request, accessToken),
    body: requestBody,
    cache: 'no-store',
  });

const createProxyResponse = async (response: Response) => {
  const responseHeaders = new Headers();
  for (const headerName of FORWARDED_RESPONSE_HEADERS) {
    const headerValue = response.headers.get(headerName);
    if (headerValue) {
      responseHeaders.set(headerName, headerValue);
    }
  }

  return new NextResponse(response.status === 204 ? null : await response.arrayBuffer(), {
    status: response.status,
    headers: responseHeaders,
  });
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
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const requestBody = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();

  let response = await fetchUpstream(targetUrl, request, requestBody, accessToken);
  let authResponse = response.clone();

  const shouldRefresh = response.status === 401 && pathname !== 'auth/refresh' && !!refreshToken;
  if (shouldRefresh && refreshToken) {
    const refreshedTokens = await refreshTokens(refreshToken);

    if (!refreshedTokens?.accessToken) {
      const unauthorizedResponse = await createProxyResponse(response);
      clearAuthCookies(unauthorizedResponse);
      return unauthorizedResponse;
    }

    response = await fetchUpstream(targetUrl, request, requestBody, refreshedTokens.accessToken);
    authResponse = response.clone();

    const retryResponse = await createProxyResponse(response);
    applyAuthCookies(retryResponse, refreshedTokens);
    await syncAuthCookies(pathname, authResponse, retryResponse);
    return retryResponse;
  }

  const nextResponse = await createProxyResponse(response);

  await syncAuthCookies(pathname, authResponse, nextResponse);

  return nextResponse;
};

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
