'use server';
/**
 * @description 서버 컴포넌트에서 API 요청을 보낼 때 사용하는 유틸 함수입니다. 클라이언트 컴포넌트에서는 사용하지 말아주세요
 */
import { cookies } from 'next/headers';
import { ApiError, toQueryString } from './utils';

type QueryValue = string | number | boolean | null | undefined | Array<string | number | boolean>;

const apiBaseUrl = (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

type ServerApiRequestOptions<TBody> = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  params?: Record<string, QueryValue>;
  body?: TBody;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

export const serverApiRequest = async <TResponse, TBody = never>(
  url: string,
  options: ServerApiRequestOptions<TBody> = {},
): Promise<TResponse> => {
  const { method = 'GET', params, body, headers, cache = 'no-store', next } = options;
  const queryString = toQueryString(params);
  const resolvedUrl = url.startsWith('/api/') && apiBaseUrl ? `${apiBaseUrl}${url}` : url;
  const requestUrl = queryString ? `${resolvedUrl}?${queryString}` : resolvedUrl;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(requestUrl, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
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
