import type { MetadataRoute } from 'next';
import { getPortfolio } from '@/lib/content';
import { categories } from '@/lib/types';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { projects } = await getPortfolio();
  return ['','/work','/about','/contact',...categories.map(c => `/work/${c.slug}`),...projects.map(p => `/projects/${p.slug}`)].map(path => ({ url: base + path, changeFrequency: 'weekly', priority: path === '' ? 1 : .7 }));
}
