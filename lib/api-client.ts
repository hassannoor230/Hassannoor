const configuredApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
export const apiBase = configuredApi
  ? configuredApi.endsWith('/api/v1') ? configuredApi : `${configuredApi}/api/v1`
  : undefined;
export const apiOrigin = configuredApi?.replace(/\/api\/v1\/?$/, '') ?? '';