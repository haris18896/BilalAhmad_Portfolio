'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { project, siteSettings } from './src/sanity/schema';
import { categories } from './src/lib/types';

export default defineConfig({
  name: 'bilal-portfolio', title: 'Bilal Ahmad · Portfolio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h80ypbl3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool({
    structure: S => S.list().title('Portfolio').items([
      S.listItem().title('Profile & website').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...categories.map(c => S.listItem().title(c.title).child(
        S.documentList().title(c.title).schemaType('project')
          .filter('_type == "project" && category == $category').params({ category: c.slug })
          .initialValueTemplates([S.initialValueTemplateItem('project-category', { category: c.slug })]),
      )),
      S.divider(),
      S.documentTypeListItem('project').title('All projects'),
    ]),
  })],
  schema: {
    types: [project, siteSettings],
    templates: prev => [
      ...prev.filter(template => template.schemaType !== 'siteSettings'),
      { id: 'project-category', title: 'Project in discipline', schemaType: 'project', parameters: [{ name: 'category', type: 'string' }], value: (params: { category: string }) => ({ category: params.category }) },
    ],
  },
  document: {
    actions: (prev, context) => context.schemaType === 'siteSettings' ? prev.filter(action => action.action !== 'duplicate') : prev,
  },
});
