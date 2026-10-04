import type { Metadata } from 'next';
import { getPortfolio } from '@/lib/content';
import { ProjectCard } from '@/components/project-card';
import { DisciplineNav, Eyebrow, SectionHeading, ExpertiseSummary } from '@/components/editorial';
export const metadata: Metadata = { title: 'Selected work' };
export default async function Work() {
  const { projects } = await getPortfolio();
  return <section className="work-page section-pad"><div className="page-intro"><Eyebrow>DESIGNING A BETTER BUILT ENVIRONMENT</Eyebrow><h1>Selected work.</h1><p className="page-subtitle">Architecture, interiors, and digital craft.</p></div><DisciplineNav all />{projects.length ? <div className="archive-grid">{projects.map(p => <ProjectCard key={p._id} project={p} />)}</div> : <div className="empty-state"><h2>Projects coming soon.</h2><p>Explore Architecture, Interiors, and BIM above.</p></div>}<section className="archive-expertise"><SectionHeading title="Areas of expertise" /><ExpertiseSummary /></section></section>;
}
