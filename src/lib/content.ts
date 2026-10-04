import 'server-only';
import { client } from '@/sanity/client';
import { defaultSettings, starterProjects } from './starter-content';
import { type Project, type Settings } from './types';
import { resolvePortfolio } from './resolve-content';
import { cache } from 'react';
import { unstable_rethrow } from 'next/navigation';

const query = `{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0] {
    name, headline, introduction, about, email, phone, behance, linkedin, instagram,
    "portrait": portrait.asset->url, "cvUrl": cv.asset->url,
    "heroModelUrl": heroModel.asset->url, "heroPoster": heroPoster.asset->url, experience
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc) {
    _id, title, "slug": slug.current, category, summary, year, location, role,
    featured, order, tools, body, "cover": cover.asset->url, "coverAlt": cover.alt,
    "gallery": gallery[]{ "url": asset->url, alt, caption },
    "videoUrl": video.asset->url, "modelUrl": model.asset->url,
    "attachments": attachments[]{ title, "url": file.asset->url }
  }
}`;

export const getPortfolio = cache(async (): Promise<{ settings: Settings; projects: Project[] }> => {
  try {
    const result = await client.fetch<{ settings: Partial<Settings> | null; projects: Project[] }>(
      query, {}, { cache: 'no-store', timeout: 6000, token: process.env.SANITY_API_READ_TOKEN },
    );
    return resolvePortfolio(result);
  } catch (error) {
    unstable_rethrow(error);
    console.error('Sanity content unavailable; serving the local portfolio.', error instanceof Error ? error.message : 'Unknown error');
    return { settings: defaultSettings, projects: starterProjects };
  }
});
