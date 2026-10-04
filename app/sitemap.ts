import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/api';
import { site } from '@/lib/site';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/projects', '/about', '/skills', '/experience', '/process', '/contact', '/privacy', '/terms'];
  const projects = await getProjects();
  return [...pages.map((p) => ({ url: `${site.url}${p}` })), ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}` }))];
}
