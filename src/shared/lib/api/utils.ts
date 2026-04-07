type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const toQueryString = (params?: Record<string, QueryValue>): string => {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) continue;
        searchParams.append(key, String(item));
      }
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams.toString();
};

const apiProxyPrefix = '/api/proxy';

const normalizeOrigin = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
};

const getServerOrigin = (): string => {
  const configuredOrigin = normalizeOrigin(
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? process.env.VERCEL_URL,
  );

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  throw new Error('APP_URL or VERCEL_URL is not defined in environment variables');
};

const getServerRequestContext = async (): Promise<{ origin: string; cookieHeader: string }> => {
  try {
    const [{ headers: nextHeaders, cookies: nextCookies }] = await Promise.all([import('next/headers')]);
    const requestHeaders = await nextHeaders();
    const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
    const protocol =
      requestHeaders.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https');
    const cookieStore = await nextCookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');

    if (host) {
      return {
        origin: `${protocol}://${host}`,
        cookieHeader,
      };
    }
  } catch (error) {
    console.warn('Could not get server request context, falling back to configured origin. Error:', error);
  }

  return {
    origin: getServerOrigin(),
    cookieHeader: '',
  };
};

export const toProxyPath = (url: string): string => {
  if (!url.startsWith('/api/')) {
    return url;
  }

  const normalizedUrl = url.replace(/^\/api\/v1\/?/, '');
  return `${apiProxyPrefix}/${normalizedUrl}`;
};

type ApiRequestOptions<TBody> = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  params?: Record<string, QueryValue>;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

export const apiRequest = async <TResponse, TBody = never>(
  url: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> => {
  const { method = 'GET', params, body, headers, signal, cache, next } = options;
  const queryString = toQueryString(params);
  const proxyPath = toProxyPath(url);
  const serverRequestContext =
    typeof window === 'undefined' && proxyPath.startsWith('/') ? await getServerRequestContext() : null;
  const resolvedUrl = serverRequestContext ? `${serverRequestContext.origin}${proxyPath}` : proxyPath;
  const requestUrl = queryString ? `${resolvedUrl}?${queryString}` : resolvedUrl;

  const response = await fetch(requestUrl, {
    method,
    credentials: 'include',
    signal,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(serverRequestContext?.cookieHeader ? { Cookie: serverRequestContext.cookieHeader } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache,
    next,
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;
    let message = fallbackMessage;
    let code: string | undefined;

    try {
      const errorBody = (await response.json()) as { message?: string; code?: string };
      message = errorBody.message ?? fallbackMessage;
      code = errorBody.code;
    } catch (error) {
      console.warn('Failed to parse error response as JSON. Using fallback message. Error:', error);
    }

    throw new ApiError(response.status, message, code);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
};
