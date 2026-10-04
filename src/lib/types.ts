import type { PortableTextBlock } from '@portabletext/types';

export const categories = [
  { slug: 'architecture', title: 'Architecture', number: '01', description: 'Ideas given form. Spaces designed for the way we live.', detail: 'Concepts, spatial planning, and architectural documentation — from the first line to the built environment.' },
  { slug: 'interiors', title: 'Interiors', number: '02', description: 'Material, light, and the feeling of a place.', detail: 'Thoughtful interior environments shaped through material selection, detailed design, and visualization.' },
  { slug: 'bim', title: 'BIM', number: '03', description: 'Design intelligence, built into every detail.', detail: 'Building Information Modeling, parametric families, and coordinated documentation for clear, collaborative delivery.' },
] as const;
export type Category = typeof categories[number]['slug'];
export function isCategory(value: string): value is Category {
  return categories.some(category => category.slug === value);
}
export type GalleryImage = { url: string; alt: string; caption?: string };
export type Project = {
  _id: string; title: string; slug: string; category: Category; summary: string;
  cover: string; coverAlt: string; year?: string; location?: string; role?: string;
  featured?: boolean; order?: number; tools?: string[]; gallery?: GalleryImage[];
  body?: PortableTextBlock[]; videoUrl?: string; modelUrl?: string;
  attachments?: { title: string; url: string }[]; sourceUrl?: string;
};
export type Settings = {
  name: string; headline: string; introduction: string; about: string;
  email: string; phone: string; portrait: string; cvUrl: string;
  behance: string; linkedin: string; instagram: string;
  heroModelUrl?: string; heroPoster?: string;
  experience: { title: string; company: string; period: string; description: string }[];
};
