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
    experience, education
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc) {
    _id, title, "slug": slug.current, category, summary, year, location, role,
    featured, order, tools, body, studio, projectType, storyTitle,
    "cover": cover.asset->url, "coverAlt": cover.alt, "coverHotspot": cover.hotspot,
    "gallery": gallery[]{ "url": asset->url, alt, caption, kind, detailZoom, hotspot },
    "videoUrl": video.asset->url, "videoPoster": videoPoster.asset->url,
    "attachments": attachments[]{ title, "url": file.asset->url }
  }
}`;

type Portfolio = { settings: Settings; projects: Project[] };

// ponytail: one in-flight read shared by every page. 30s memory, per-instance; a shared cache if more than one server runs.
const freshFor = 30_000;
let memory: { at: number; value: Portfolio } | undefined;
let inflight: Promise<Portfolio> | undefined;

function isNetworkError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  const message = error instanceof Error ? error.message : '';
  return /timed out|fetch failed|ECONN|ETIMEDOUT|ENOTFOUND|EAI_AGAIN/i.test(`${code} ${message}`);
}

async function fetchPortfolio() {
  const result = await client.fetch<{ settings: Partial<Settings> | null; projects: Project[] }>(
    query, {}, { timeout: 12_000, next: { revalidate: 60 }, token: process.env.SANITY_API_READ_TOKEN },
  );
  return resolvePortfolio(result);
}

async function loadPortfolio() {
  try {
    return await fetchPortfolio();
  } catch (error) {
    unstable_rethrow(error);
    if (!isNetworkError(error)) throw error;
    return fetchPortfolio();
  }
}

export const getPortfolio = cache(async (): Promise<Portfolio> => {
  if (memory && Date.now() - memory.at < freshFor) return memory.value;
  inflight ??= loadPortfolio()
    .then((value) => {
      memory = { at: Date.now(), value };
      return value;
    })
    .catch((error) => {
      unstable_rethrow(error);
      console.error('Sanity content unavailable; serving the local portfolio.', error instanceof Error ? error.message : 'Unknown error');
      const value = memory?.value ?? { settings: defaultSettings, projects: starterProjects };
      memory = { at: Date.now(), value };
      return value;
    })
    .finally(() => { inflight = undefined; });
  return inflight;
});
