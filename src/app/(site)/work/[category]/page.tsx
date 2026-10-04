import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolio } from '@/lib/content';
import { categories, isCategory } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';

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
  return <section className="work-page section-pad"><div className="page-intro"><p className="eyebrow">{discipline.number} / SELECTED WORK</p><h1>{discipline.title}<span className="heading-period">.</span></h1><p>{discipline.detail}</p></div><nav className="work-tabs" aria-label="Project disciplines"><Link href="/work">All work <sup>{all.length}</sup></Link>{categories.map(c => <Link key={c.slug} href={`/work/${c.slug}`} className={c.slug === category ? 'active' : ''} aria-current={c.slug === category ? 'page' : undefined}>{c.title} <sup>{all.filter(p => p.category === c.slug).length}</sup></Link>)}</nav>{projects.length ? <div className="archive-grid">{projects.map((p,i) => <ProjectCard key={p._id} project={p} index={i} />)}</div> : <div className="empty-state"><h2>More perspectives to come.</h2><p>New {discipline.title.toLowerCase()} work will appear here as it’s published.</p><Link className="text-link" href="/contact">Discuss a project ↗</Link></div>}</section>;
}
