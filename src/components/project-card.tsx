import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { categories, type Project } from '@/lib/types';

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const category = categories.find(c => c.slug === project.category)!;
  return <Link href={`/projects/${project.slug}`} className="project-card">
    <div className="project-image"><Image src={project.cover} alt={project.coverAlt || project.title} fill sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw" /><span className="project-category">{category.title}</span><span className="project-open"><ArrowUpRight size={24} strokeWidth={1.4} /></span></div>
    <div className="project-caption"><span className="project-number">{String(index + 1).padStart(2, '0')}</span><h3>{project.title}</h3><span className="project-year">{project.year || category.title}</span></div>
  </Link>;
}
