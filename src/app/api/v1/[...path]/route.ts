import { NextRequest, NextResponse } from 'next/server';

const apiBaseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

const buildTargetUrl = (request: NextRequest, path: string[]) => {
  if (!apiBaseUrl) {
    throw new Error('API base URL is not configured.');
  }

  const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, '');
  const targetUrl = new URL(`${normalizedBaseUrl}/api/v1/${path.join('/')}`);
  targetUrl.search = request.nextUrl.search;

  return targetUrl;
};

const buildCookieHeader = (request: NextRequest) => {
  const incomingCookies = request.headers.get('cookie') ?? '';
  const tempToken = process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN;

  if (!tempToken || incomingCookies.includes('accessToken=')) {
    return incomingCookies || null;
  }

  return incomingCookies ? `${incomingCookies}; accessToken=${tempToken}` : `accessToken=${tempToken}`;
};

const proxy = async (request: NextRequest, context: { params: Promise<{ path: string[] }> }) => {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(request, path);
  const cookieHeader = buildCookieHeader(request);
  const shouldLog = process.env.NODE_ENV === 'development';

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');
  headers.delete('origin');
  headers.delete('referer');
  headers.delete('authorization');
  headers.delete('sec-fetch-dest');
  headers.delete('sec-fetch-mode');
  headers.delete('sec-fetch-site');

  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
    redirect: 'manual',
  });

  const responseHeaders = new Headers(response.headers);
  const setCookie = response.headers.get('set-cookie');

  if (setCookie) {
    responseHeaders.set('set-cookie', setCookie);
  }

  if (shouldLog && response.status >= 400) {
    const clonedResponse = response.clone();
    const errorBody = await clonedResponse.text();
    console.error('[api proxy error body]', errorBody);
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
};

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
