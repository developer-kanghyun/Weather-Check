export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  baseUrl?: string;
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string | undefined>;
  body?: unknown;
  signal?: AbortSignal;
};

export class HttpError extends Error {
  readonly name = 'HttpError';
  readonly status: number;
  readonly url: string;
  readonly bodyText?: string;

  constructor(params: { status: number; url: string; message: string; bodyText?: string }) {
    super(params.message);
    this.status = params.status;
    this.url = params.url;
    this.bodyText = params.bodyText;
  }
}

const buildUrl = (baseUrl: string, path: string, query?: RequestOptions['query']): string => {
  const url = new URL(path, baseUrl);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === null || v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export const requestJson = async <T,>(options: RequestOptions): Promise<T> => {
  const {
    method = 'GET',
    baseUrl = '',
    path,
    query,
    headers,
    body,
    signal,
  } = options;

  const url = buildUrl(baseUrl, path, query);

  const res = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : undefined),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  // fetch는 4xx/5xx에서 reject 되지 않으므로 ok 체크
  if (!res.ok) {
    const bodyText = await res.text().catch(() => undefined);
    throw new HttpError({
      status: res.status,
      url,
      message: `HTTP ${res.status} for ${url}`,
      bodyText,
    });
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
