import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h80ypbl3';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const client = createClient({
  projectId, dataset, apiVersion: '2026-10-01',
  useCdn: false, perspective: 'published',
});
