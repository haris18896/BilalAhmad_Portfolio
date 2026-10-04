import Link from 'next/link';
import type { Metadata } from 'next';
import { getPortfolio } from '@/lib/content';
import { categories } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';

export const metadata: Metadata = { title: 'Selected work' };
export default async function Work() {
  const { projects } = await getPortfolio();
  return <section className="work-page section-pad"><div className="page-intro"><p className="eyebrow">THE PROJECT ARCHIVE</p><h1>A body of work.<br /><span>A world of possibilities.</span></h1><p>Explore architecture, interiors, and BIM — each a distinct practice, connected by considered design.</p></div><nav className="work-tabs" aria-label="Project disciplines"><Link href="/work" className="active">All work <sup>{projects.length}</sup></Link>{categories.map(c => <Link key={c.slug} href={`/work/${c.slug}`}>{c.title} <sup>{projects.filter(p => p.category === c.slug).length}</sup></Link>)}</nav>{projects.length ? <div className="archive-grid">{projects.map((p,i) => <ProjectCard key={p._id} project={p} index={i} />)}</div> : <p className="empty-state">New work will be published here soon.</p>}</section>;
}
