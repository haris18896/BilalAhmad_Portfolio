import { createClient } from 'next-sanity';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { starterProjects, defaultSettings } from '../src/lib/starter-content';

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error('Set SANITY_API_WRITE_TOKEN in .env.local to an Editor token before running npm run seed. Do not put it in a NEXT_PUBLIC_ variable.');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h80ypbl3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-10-01', useCdn: false, token,
});
async function upload(path: string, kind: 'image' | 'file') {
  if (!path.startsWith('/')) throw new Error('Expected a local public asset.');
  return client.assets.upload(kind, createReadStream(resolve('public', path.slice(1))), { filename: path.split('/').pop() });
}
const settingsExist = await client.fetch('defined(*[_id == "siteSettings"][0])');
if (!settingsExist) {
  const portrait = await upload(defaultSettings.portrait, 'image');
  const cv = await upload(defaultSettings.cvUrl, 'file');
  const settings = { ...defaultSettings, cvUrl: undefined, portrait: undefined };
  await client.createIfNotExists({
    _id: 'siteSettings', _type: 'siteSettings', ...settings,
    portrait: { _type: 'image', asset: { _type: 'reference', _ref: portrait._id }, alt: 'Portrait of Bilal Ahmad' },
    cv: { _type: 'file', asset: { _type: 'reference', _ref: cv._id } },
    experience: settings.experience.map(item => ({ ...item, _key: randomUUID(), _type: 'experienceItem' })),
    education: settings.education?.map(item => ({ ...item, _key: randomUUID(), _type: 'educationItem' })),
  });
  console.log('Imported profile and CV.');
}
for (const project of starterProjects) {
  const id = project._id.replace('starter-', 'portfolio-');
  if (await client.fetch('defined(*[_id == $id][0])', { id })) { console.log('Already imported:', project.title); continue; }
  const cover = await upload(project.cover, 'image');
  const gallery = [];
  for (const item of project.gallery || []) {
    const asset = await upload(item.url, 'image');
    gallery.push({ _key: randomUUID(), _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: item.alt, caption: item.caption, kind: item.kind || 'image', detailZoom: item.detailZoom, ...(item.hotspot ? { hotspot: { _type: 'sanity.imageHotspot', ...item.hotspot, width: .3, height: .3 } } : {}) });
  }
  const attachments = [];
  for (const item of project.attachments || []) {
    const asset = await upload(item.url, 'file');
    attachments.push({ _key: randomUUID(), _type: 'attachment', title: item.title, file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } } });
  }
  await client.createIfNotExists({
    _id: id, _type: 'project', title: project.title, slug: { _type: 'slug', current: project.slug },
    category: project.category, summary: project.summary, year: project.year, location: project.location,
    role: project.role, studio: project.studio, projectType: project.projectType, storyTitle: project.storyTitle, featured: project.featured || false, order: project.order, tools: project.tools,
    cover: { _type: 'image', asset: { _type: 'reference', _ref: cover._id }, alt: project.coverAlt },
    gallery, attachments,
    body: [{ _type: 'block', _key: randomUUID(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: randomUUID(), text: project.summary, marks: [] }] }],
  });
  console.log('Imported:', project.title);
}
console.log('Done. Open /studio to edit. Existing documents were preserved.');
