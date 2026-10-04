import { defineField, defineType } from 'sanity';
import { categories } from '../lib/types';

const image = (name: string, title: string) => defineField({
  name, title, type: 'image', options: { hotspot: true },
  fields: [defineField({ name: 'alt', title: 'Image description', type: 'string', description: 'Describe the image for visitors using screen readers.', validation: rule => rule.required() })],
});

export const project = defineType({
  name: 'project', title: 'Project', type: 'document',
  groups: [
    { name: 'details', title: 'Project details', default: true },
    { name: 'media', title: 'Images & media' },
    { name: 'story', title: 'Project story' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Project title', type: 'string', group: 'details', validation: r => r.required().max(100) }),
    defineField({ name: 'slug', title: 'Website URL', type: 'slug', options: { source: 'title', maxLength: 96 }, group: 'details', validation: r => r.required() }),
    defineField({ name: 'category', title: 'Discipline', type: 'string', options: { list: categories.map(c => ({ title: c.title, value: c.slug })), layout: 'radio' }, group: 'details', validation: r => r.required().custom(value => ['architecture', 'interiors', 'bim'].includes(value || '') || 'Choose Architecture, Interiors, or BIM.') }),
    defineField({ name: 'summary', title: 'Short introduction', type: 'text', rows: 3, group: 'details', validation: r => r.required().max(400) }),
    defineField({ name: 'year', type: 'string', group: 'details' }),
    defineField({ name: 'location', type: 'string', group: 'details' }),
    defineField({ name: 'role', title: 'Your role', type: 'string', group: 'details' }),
    defineField({ name: 'studio', title: 'Collaborating studio / credit', type: 'string', group: 'details' }),
    defineField({ name: 'projectType', title: 'Project type', type: 'string', group: 'details', description: 'For example: Residential design, Café interior, Academic thesis.' }),
    defineField({ name: 'storyTitle', title: 'Overview heading', type: 'string', group: 'story' }),
    defineField({ name: 'tools', title: 'Tools & services', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, group: 'details' }),
    defineField({ name: 'featured', title: 'Feature on homepage', type: 'boolean', initialValue: false, group: 'details' }),
    defineField({ name: 'order', title: 'Display order', type: 'number', initialValue: 10, description: 'Lower numbers appear first.', group: 'details', validation: r => r.integer().min(0) }),
    defineField({ ...image('cover', 'Cover image'), group: 'media', validation: r => r.required() }),
    defineField({ name: 'gallery', title: 'Project gallery', type: 'array', group: 'media', of: [{
      type: 'image', options: { hotspot: true }, fields: [
        { name: 'alt', title: 'Image description', type: 'string', validation: r => r.required() },
        { name: 'caption', title: 'Caption', type: 'string' },
        { name: 'kind', title: 'Display section', type: 'string', initialValue: 'image', options: { list: [{ title: 'Selected views', value: 'image' }, { title: 'Drawings & documentation', value: 'drawing' }, { title: 'Material & detail', value: 'material' }] } },
        { name: 'detailZoom', title: 'Detail crop zoom', type: 'number', description: 'Optional thumbnail zoom for a material detail; the lightbox keeps the full source image.', validation: r => r.min(1).max(3) },
      ],
    }] }),
    defineField({ name: 'video', title: 'Project video', type: 'file', options: { accept: 'video/mp4,video/webm' }, group: 'media', description: 'Upload an MP4 or WebM walkthrough. It appears on the project page.' }),
    defineField({ ...image('videoPoster', 'Video poster'), group: 'media' }),
    defineField({ name: 'attachments', title: 'Project files', type: 'array', group: 'media', of: [{
      type: 'object', name: 'attachment', fields: [
        { name: 'title', title: 'Download label', type: 'string', validation: r => r.required() },
        { name: 'file', title: 'File', type: 'file', validation: r => r.required() },
      ],
    }] }),
    defineField({ name: 'body', title: 'Project story', type: 'array', of: [{ type: 'block' }], group: 'story', description: 'Explain the brief, concept, design decisions, and your contribution.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'category', media: 'cover' } },
});

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Profile & website', type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'headline', title: 'Homepage headline', type: 'string', validation: r => r.required().max(80) }),
    defineField({ name: 'introduction', title: 'Homepage introduction', type: 'text', rows: 3 }),
    defineField({ name: 'about', title: 'About you', type: 'text', rows: 5 }),
    image('portrait', 'Profile portrait'),
    defineField({ name: 'cv', title: 'CV', type: 'file', options: { accept: '.pdf' } }),
    defineField({ name: 'email', title: 'Contact email', type: 'string', validation: r => r.email() }),
    defineField({ name: 'phone', title: 'Phone (international format)', type: 'string' }),
    defineField({ name: 'behance', type: 'url' }),
    defineField({ name: 'linkedin', type: 'url' }),
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'experience', title: 'Experience', type: 'array', of: [{
      type: 'object', name: 'experienceItem', fields: [
        { name: 'title', type: 'string', validation: r => r.required() },
        { name: 'company', type: 'string', validation: r => r.required() },
        { name: 'period', type: 'string' },
        { name: 'description', type: 'text', rows: 2 },
      ], preview: { select: { title: 'title', subtitle: 'company' } },
    }] }),
    defineField({ name: 'education', title: 'Education', type: 'array', of: [{
      type: 'object', name: 'educationItem', fields: [
        { name: 'title', title: 'Qualification', type: 'string', validation: r => r.required() },
        { name: 'company', title: 'Institution', type: 'string', validation: r => r.required() },
        { name: 'period', type: 'string' },
        { name: 'description', type: 'text', rows: 2 },
      ], preview: { select: { title: 'title', subtitle: 'company' } },
    }] }),
  ],
});
