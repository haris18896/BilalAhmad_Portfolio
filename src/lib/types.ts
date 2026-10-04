import type { PortableTextBlock } from '@portabletext/types';

export const categories = [
  { slug: 'architecture', title: 'Architecture', number: '01', description: 'From first idea to built form.', detail: 'Thoughtful, contextual architecture designed for people and place.', services: ['Concept design', 'Spatial planning', 'Technical drawings'] },
  { slug: 'interiors', title: 'Interiors', number: '02', description: 'Material, light, and everyday life.', detail: 'Considered interior spaces shaped by material, light, and the rhythms of daily life.', services: ['Space planning', 'Materials & lighting', 'Interior visualization'] },
  { slug: 'bim', title: 'BIM', number: '03', description: 'Design precision. Coordinated delivery.', detail: 'From concept models to detailed documentation, connecting design intent with technical clarity.', services: ['Revit modelling', 'Coordination', 'Documentation'] },
] as const;
export type Category = typeof categories[number]['slug'];
export function isCategory(value: string): value is Category {
  return categories.some(category => category.slug === value);
}
export type GalleryImage = { url: string; alt: string; caption?: string; kind?: 'image' | 'drawing' | 'material'; detailZoom?: number; hotspot?: { x: number; y: number } };
export type Project = {
  _id: string; title: string; slug: string; category: Category; summary: string;
  cover: string; coverAlt: string; year?: string; location?: string; role?: string;
  featured?: boolean; order?: number; tools?: string[]; gallery?: GalleryImage[];
  body?: PortableTextBlock[]; videoUrl?: string; videoPoster?: string;
  studio?: string; projectType?: string; storyTitle?: string; coverHotspot?: { x: number; y: number };
  attachments?: { title: string; url: string }[]; sourceUrl?: string;
};
export type Settings = {
  name: string; headline: string; introduction: string; about: string;
  email: string; phone: string; portrait: string; cvUrl: string;
  behance: string; linkedin: string; instagram: string;
  education?: { title: string; company: string; period: string; description: string }[];
  experience: { title: string; company: string; period: string; description: string }[];
};
