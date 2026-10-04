import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories, type Project } from '@/lib/types';
export function ProjectCard({ project }: { project: Project; index?: number }) {
  const category = categories.find(c => c.slug === project.category)!;
  return <Link href={'/projects/' + project.slug} className="project-card" data-category={project.category} data-reveal>
    <div className="project-image"><Image src={project.cover} alt={project.coverAlt || project.title} fill sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 45vw" style={project.coverHotspot ? { objectPosition: (project.coverHotspot.x * 100) + '% ' + (project.coverHotspot.y * 100) + '%' } : undefined} /></div>
    <div className="project-caption"><h3>{project.title}</h3><ArrowRight size={23} strokeWidth={1.2} /></div><p className="project-category">{category.title}{project.projectType === 'Academic thesis' ? ' · Academic' : ''}</p>
  </Link>;
}
