import { fallbackProjects } from './data';
import type { Category, Project, SiteProfile } from './types';
const configuredApi = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
const API = configuredApi
  ? configuredApi.endsWith('/api/v1') ? configuredApi : `${configuredApi}/api/v1`
  : undefined;
export const apiOrigin = configuredApi?.replace(/\/api\/v1\/?$/, '') ?? '';
const fallbackCategories: Category[] = [...new Map(
  fallbackProjects.filter((project) => project.category).map((project) => [project.category!.slug, project.category!]),
).values()];

// Returns null only when the API is unconfigured or unreachable; a reachable API's answer is authoritative.
async function call(path: string): Promise<{ status: number; data: any } | null> {
  if (!API) return null;
  try {
    const r = await fetch(`${API}${path}`, { next: { revalidate: 60 } });
    const j = await r.json().catch(() => null);
    return { status: r.status, data: j?.data ?? j };
  } catch { return null; }
}
export async function getProjects(): Promise<Project[]> {
  const r = await call('/projects');
  if (!r || r.status === 404) return fallbackProjects;
  const items = Array.isArray(r.data) ? r.data : r.data?.items;
  return r.status === 200 && Array.isArray(items) ? items.map(normalizeProjectMedia) : [];
}
export async function getCategories(): Promise<Category[]> {
  const r = await call('/categories');
  if (!r || r.status === 404) return fallbackCategories;
  const items = Array.isArray(r.data) ? r.data : r.data?.items;
  return r.status === 200 && Array.isArray(items) ? items : [];
}
export async function getProject(slug: string): Promise<Project | null> {
  const r = await call(`/projects/${encodeURIComponent(slug)}`);
  if (!r) return fallbackProjects.find((p) => p.slug === slug) ?? null;
  return r.status === 200 ? normalizeProjectMedia(r.data) : null;
}
export function absoluteUrl(path: string) {
  const url = new URL(path, `${apiOrigin || 'http://localhost:4000'}/`);
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    if (!apiOrigin) return `${url.pathname}${url.search}${url.hash}`;
    return new URL(`${url.pathname}${url.search}${url.hash}`, `${apiOrigin}/`).toString();
  }
  return url.toString();
}

function normalizeProjectMedia(project: Project): Project {
  return {
    ...project,
    coverImage: project.coverImage?.url
      ? { ...project.coverImage, url: absoluteUrl(project.coverImage.url) }
      : project.coverImage,
    gallery: project.gallery?.map((image) => ({ ...image, url: absoluteUrl(image.url) })),
  };
}
// Returns null until a profile is saved from the admin dashboard, so the site config in lib/site stays in charge.
export async function getProfile(): Promise<SiteProfile | null> {
  const r = await call('/profile');
  if (!r || r.status !== 200 || !r.data) return null;
  const portraitUrl = r.data.portrait?.url as string | undefined;
  return { ...r.data, portrait: portraitUrl ? { ...r.data.portrait, url: absoluteUrl(portraitUrl) } : null };
}
export const apiBase = API;
