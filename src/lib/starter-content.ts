import type { Project, Settings } from './types';

export const defaultSettings: Settings = {
  name: 'Bilal Ahmad',
  headline: 'A different perspective.',
  introduction: 'Architecture, interiors, and digital craft. Thoughtful spaces, from first idea to the finest detail.',
  about: 'I’m Bilal, an architectural designer and BIM architect. My practice brings together spatial thinking, material exploration, and digital precision — creating environments that connect people with the spaces around them.',
  email: 'bilalahmadk37@gmail.com',
  phone: '+923195791745',
  portrait: '/images/bilal-charcoal.png',
  cvUrl: '/files/bilal-ahmad-cv.pdf',
  behance: 'https://www.behance.net/bilalahmad128',
  linkedin: 'https://www.linkedin.com/in/ar-bilal-ahmad',
  instagram: 'https://www.instagram.com/ar.bilalahmadkhan/',
  experience: [
    { title: 'Senior Architect', company: 'MAS-DESIGNS', period: 'Nov 2025 — Jul 2026', description: 'Residential and commercial design, interior development, site coordination, and project delivery.' },
    { title: 'BIM Architect', company: 'ARCHILANCE LLC', period: 'Mar 2025 — Oct 2025', description: 'Revit models, parametric families, construction documentation, and multidisciplinary coordination.' },
    { title: 'Architecture graduate', company: 'UET Peshawar', period: '2020 — 2025', description: 'Bachelor of Science in Architecture. An education grounded in design, technology, and the built environment.' },
  ],
};

// Source-grounded starter work. Publishing CMS content replaces this local collection.
export const starterProjects: Project[] = [
  {
    _id: 'starter-rising-the-tech', slug: 'rising-the-tech', title: 'Rising the Tech', category: 'architecture',
    summary: 'A final-year thesis exploring future hubs for AI, creativity, and technological growth.',
    cover: '/images/projects/rising-the-tech.jpg', coverAlt: 'Architectural visualization from Bilal Ahmad’s final-year thesis',
    year: '2025', role: 'Academic thesis', featured: true, order: 1,
    gallery: [{ url: '/images/projects/rising-the-tech.jpg', alt: 'Rising the Tech architectural visualization' }],
    sourceUrl: 'https://drive.google.com/drive/folders/1_1u0LsELGDwG6nLbtVtHAHFidnvgOohg',
    tools: ['Architectural design', 'Visualization'],
  },
  {
    _id: 'starter-coffee-bean', slug: 'coffee-bean', title: 'Coffee Bean', category: 'interiors',
    summary: 'An interior design study presented through spatial layouts, material choices, and visualizations.',
    cover: '/images/projects/coffee-bean.jpg', coverAlt: 'Coffee Bean interior design by Bilal Ahmad',
    role: 'Interior design', featured: true, order: 2,
    year: '2026',
    gallery: [6,7,9,11].map(index => ({ url: `/images/projects/coffee-bean-${index}.jpg`, alt: 'Coffee Bean interior design visualization', caption: 'Coffee Bean · interior visualization' })),
    attachments: [{ title: 'Project presentation', url: '/files/coffee-bean.pdf' }],
    sourceUrl: 'https://drive.google.com/file/d/16a2ZmA6RTPmSZYqaH6axXXVhkcwrkNAo/view',
    tools: ['Interior design', 'Material selection'],
  },
  {
    _id: 'starter-bim-portfolio', slug: 'bim-design-and-coordination', title: 'Modeling & coordination', category: 'bim',
    summary: 'A collection of BIM work, demonstrating digital modeling and coordinated architectural documentation.',
    cover: '/images/projects/bim-portfolio.jpg', coverAlt: 'BIM project work from Bilal Ahmad’s portfolio',
    role: 'BIM architecture', featured: true, order: 3,
    gallery: [6,8,12].map(index => ({ url: `/images/projects/bim-${index}.jpg`, alt: 'BIM models and architectural documentation from Bilal’s portfolio' })),
    attachments: [{ title: 'BIM portfolio', url: '/files/bim-portfolio.pdf' }],
    sourceUrl: 'https://drive.google.com/file/d/1ECS8h3VFs037eDfXsSNw6hZmYc9tL0Eu/view',
    tools: ['Revit', 'BIM', 'Documentation'],
  },
  {
    _id: 'starter-saleem-residence', slug: 'saleem-residence', title: 'Saleem Residence', category: 'architecture',
    summary: 'Residential architectural documentation, presented as a detailed drawing set.',
    cover: '/images/projects/saleem-residence.jpg', coverAlt: 'Saleem Residence architectural drawing',
    location: 'Faisalabad, Pakistan', role: 'Architectural documentation', order: 4,
    year: '2026',
    gallery: [2,3].map((index,i) => ({ url: `/images/projects/saleem-${index}.jpg`, alt: `${i === 0 ? 'Ground' : 'First'} floor plan for Saleem Residence`, caption: `${i === 0 ? 'Ground' : 'First'} floor plan` })),
    attachments: [{ title: 'Architectural drawing set', url: '/files/saleem-residence.pdf' }],
    sourceUrl: 'https://drive.google.com/file/d/1Phb6DTDdLIKofuzuhhvQT1zWTEgRQhuE/view',
    tools: ['Architecture', 'Construction documentation'],
  },
];
