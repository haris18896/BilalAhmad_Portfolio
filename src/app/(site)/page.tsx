import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { categories } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';
import { DisciplineNav, Eyebrow, SectionHeading, ExpertiseSummary } from '@/components/editorial';

export default async function Home() {
  const { settings, projects } = await getPortfolio();
  const featured = categories.flatMap(c => {
    const entries = projects.filter(p => p.category === c.slug);
    const project = entries.find(p => p.featured) || entries[0];
    return project ? [project] : [];
  });
  const extras = projects.filter(p => p.featured && !featured.some(f => f._id === p._id)).slice(0, 6-featured.length);
  return <div className="home-page">
    <section className="hero section-pad">
      <div className="hero-copy">
        <Eyebrow>DESIGNING A BETTER BUILT ENVIRONMENT</Eyebrow>
        <h1 className="hero-title">{settings.headline === 'Spaces with purpose.' ? <><span>Spaces</span><span>with purpose.</span></> : settings.headline}</h1>
        <p className="hero-role">BIM Architect · Architectural Designer · Interior Designer</p>
        <p className="hero-intro">{settings.introduction}</p>
        <div className="hero-actions"><Link className="button" href="/work">Explore the work <ArrowUpRight size={20} strokeWidth={1.3} /></Link><a className="text-link" href={settings.cvUrl} target="_blank" rel="noreferrer">Download CV <Download size={18} strokeWidth={1.3} /></a></div>
        <div className="hero-annotation" aria-hidden="true"><span>PEOPLE<br />SPACES<br />IDEAS<br />REALITY</span><span>THROUGH<br />DESIGN</span></div>
      </div>
      <div className="hero-portrait"><Image src="/images/bilal-charcoal.png" alt="Portrait of Bilal Ahmad" fill loading="eager" fetchPriority="high" sizes="(max-width: 680px) 90vw, 35vw" /></div>
      <aside className="hero-aside" aria-hidden="true"><strong>BILAL AHMAD</strong><span className="tiny-line" /><p>ARCHITECTURE<br />INTERIORS<br />BIM<br />DETAILS<br />PEOPLE<br />SPACES</p><span className="aside-note">ALWAYS A<br />MORE THOUGHTFUL<br />TOMORROW</span></aside>
    </section>
    <div className="section-pad"><DisciplineNav /></div>
    <section className="selected-section section-pad" data-reveal><SectionHeading title="Selected work" href="/work" linkText="View all work" /><div className="project-grid">{[...featured,...extras].map(p => <ProjectCard key={p._id} project={p} />)}</div>{!featured.length && <p className="empty-state">Projects coming soon. Explore the disciplines above.</p>}</section>
    <section className="about-preview section-pad" data-reveal>
      <div className="about-photo-column"><h2>Meet Bilal</h2><div className="about-photo"><Image src="/images/bilal-navy.png" alt="Bilal Ahmad" fill sizes="(max-width: 680px) 80vw, 35vw" /></div></div>
      <div className="about-copy"><span className="tiny-line" /><h3>Design is more than form,<br />it’s coordination.</h3><p>{settings.about}</p><Link className="text-link" href="/about">About Bilal <ArrowRight size={22} strokeWidth={1.2} /></Link></div>
      <p className="editorial-aside">Architecture,<br />interiors,<br />and digital<br />craft.</p>
    </section>
    <section className="home-expertise section-pad" data-reveal><SectionHeading title="Areas of expertise" href="/expertise" linkText="Explore expertise" /><ExpertiseSummary /></section>
  </div>;
}
