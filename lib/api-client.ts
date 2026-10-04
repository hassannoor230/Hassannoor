const configuredApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
const normalizedApi = configuredApi?.replace(/\/api\/?$/, '');
export const apiBase = normalizedApi
  ? normalizedApi.endsWith('/api/v1') ? normalizedApi : `${normalizedApi}/api/v1`
  : undefined;
export const apiOrigin = normalizedApi?.replace(/\/api\/v1\/?$/, '') ?? '';