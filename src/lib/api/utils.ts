type QueryValue = string | number | boolean | null | undefined | Array<string | number | boolean>;

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
        searchParams.append(key, String(item));
      }
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams.toString();
};

const appUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:3000';

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
  const tempToken = process.env.NEXT_PUBLIC_TEMP_ACCESS_TOKEN;

  const { method = 'GET', params, body, headers, signal, cache, next } = options;
  const queryString = toQueryString(params);
  const requestUrl = queryString ? `${appUrl}${url}?${queryString}` : `${appUrl}${url}`;

  const response = await fetch(requestUrl, {
    method,
    credentials: 'include',
    signal,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(tempToken ? { Authorization: `Bearer ${tempToken}` } : {}),
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
    } catch {
      // Ignore JSON parse failure and keep fallback message.
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
