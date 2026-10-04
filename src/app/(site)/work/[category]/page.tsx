import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowUpRight, Download } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { categories, isCategory } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';
import { DisciplineNav, Eyebrow, SectionHeading, CrossDiscipline } from '@/components/editorial';
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const discipline = categories.find(c => c.slug === category);
  return { title: discipline?.title || 'Work', description: discipline?.detail };
}
export default async function DisciplineWork({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const discipline = categories.find(c => c.slug === category)!;
  const { projects: all } = await getPortfolio();
  const projects = all.filter(p => p.category === category);
  const first = projects[0];
  const views = first?.gallery?.filter(image => image.url).slice(0, category === 'bim' ? 3 : 2) || [];
  return <section className={'work-page category-page section-pad ' + category}>
    <div className="page-intro"><Eyebrow>SELECTED WORK / {discipline.number}</Eyebrow><h1>{discipline.title}</h1><p className="page-subtitle">{discipline.description}</p><p className="intro-description">{discipline.detail}</p></div>
    <DisciplineNav active={category} />
    {!first ? <div className="empty-state"><h2>Projects coming soon.</h2><p>New work will appear here as it’s published.</p><Link className="text-link" href="/work">Explore other work <ArrowUpRight size={18} /></Link></div> : category === 'architecture' ? <div className="architecture-list">{projects.map(p => <ProjectCard key={p._id} project={p} />)}</div> : <>
      <div className="collection-feature" data-reveal><Link href={'/projects/' + first.slug} className="feature-image"><Image src={first.cover} alt={first.coverAlt || first.title} fill loading="eager" sizes="(max-width: 680px) 90vw, 60vw" /></Link><div className="feature-copy"><Eyebrow>{discipline.title}</Eyebrow><h2>{first.title}</h2><p className="eyebrow">{first.projectType || first.role || 'SELECTED WORK'}</p><p>{first.summary}</p><Link className="text-link" href={'/projects/' + first.slug}>View project <ArrowUpRight size={22} strokeWidth={1.2} /></Link></div></div>
      {views.length > 0 && <section className="collection-views" data-reveal><SectionHeading title={category === 'bim' ? 'From models to documentation' : first.title + ' — selected views'} /><div className={'views-grid ' + (category === 'bim' ? 'technical-views' : '')}>{views.map((v,i) => <Link href={'/projects/' + first.slug + (v.kind === 'drawing' ? '#drawings' : '#gallery')} key={v.url}><div className="view-image"><Image src={v.url} alt={v.alt} fill sizes="(max-width: 680px) 90vw, 40vw" /></div>{category === 'bim' && <h3>{v.caption || ['Models', 'Drawings', 'Details'][i]}</h3>}</Link>)}</div></section>}
      {category === 'bim' && <div className="tools-band"><h3>Tools & expertise</h3><p>{first.tools?.join(' · ') || 'Revit · Navisworks · AutoCAD'}</p>{first.attachments?.[0] && <a className="button" href={first.attachments[0].url} target="_blank" rel="noreferrer">Download portfolio PDF <Download size={18} /></a>}</div>}
      {projects.length > 1 && <div className="archive-grid additional-projects">{projects.slice(1).map(p => <ProjectCard key={p._id} project={p} />)}</div>}
      {category === 'interiors' && <div className="collection-statement"><h2>Spaces<br />made for people.</h2><p>Thoughtful interiors that connect material, function, and atmosphere.</p></div>}
    </>}
    <CrossDiscipline active={category} />
  </section>;
}
