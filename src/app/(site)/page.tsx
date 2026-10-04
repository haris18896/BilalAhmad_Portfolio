import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Download, Layers, Box, PenTool } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { categories } from '@/lib/types';
import { ProjectCard } from '@/components/project-card';
import { ModelViewer } from '@/components/model-viewer';

export default async function Home() {
  const { settings, projects } = await getPortfolio();
  const selected = categories.map(c => projects.find(p => p.category === c.slug && p.featured) || projects.find(p => p.category === c.slug)).filter(p => p !== undefined);
  return <>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow"><span className="tiny-line" />THE PORTFOLIO OF {settings.name.toUpperCase()}</p><h1>{settings.headline}</h1><p className="hero-role">BIM Architect <span>·</span> Architectural Designer <span>·</span> Interior Designer</p><p className="hero-intro">{settings.introduction}</p><Link className="button button-dark" href="/work">Explore the work <ArrowUpRight size={18} /></Link><a className="text-link hero-cv" href={settings.cvUrl} target="_blank" rel="noreferrer">Download CV <Download size={14} /></a></div>
      <div className="hero-model"><ModelViewer modelUrl={settings.heroModelUrl} poster={settings.heroPoster} /></div>
      <div className="hero-bottom"><a href="#selected" className="scroll-hint"><ArrowDown size={16} /> SCROLL TO DISCOVER</a><span>IDEAS. SPACES. POSSIBILITIES.</span><span className="edition">PORTFOLIO / 2026</span></div>
    </section>
    <section className="selected-section section-pad" id="selected">
      <div className="section-heading"><div><p className="eyebrow">A SELECTION OF MY WORK</p><h2>Designed with intention.</h2></div><Link className="text-link" href="/work">All projects <ArrowUpRight size={17} /></Link></div>
      {selected.length ? <div className="project-grid">{selected.map((project, index) => <ProjectCard key={project._id} project={project} index={index} />)}</div> : <p className="empty-state">New projects are on their way. <Link href="/contact">Let’s discuss your next space.</Link></p>}
    </section>
    <section className="disciplines section-pad" id="expertise">
      <div className="discipline-intro"><p className="eyebrow">THREE DISCIPLINES. ONE VISION.</p><h2>From the first idea<br />to the final detail.</h2><p>Creative thinking meets technical clarity. Every discipline brings a different lens to the same ambition: better spaces.</p></div>
      <div className="discipline-list">{categories.map((category, index) => {
        const Icon = [PenTool, Box, Layers][index];
        return <Link key={category.slug} href={`/work/${category.slug}`} className="discipline-row"><span className="discipline-number">{category.number}</span><div><h3>{category.title}</h3><p>{category.description}</p></div><Icon className="discipline-icon" size={28} strokeWidth={1} /><ArrowUpRight size={22} strokeWidth={1} /></Link>;
      })}</div>
    </section>
    <section className="about-preview section-pad"><div className="portrait-wrap"><Image src={settings.portrait} alt={`Portrait of ${settings.name}`} fill sizes="(max-width: 700px) 100vw, 40vw" /><span>THE PERSON BEHIND THE PERSPECTIVE</span></div><div className="about-copy"><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Space is personal.<br />So is my practice.</h2><p>{settings.about}</p><Link href="/about" className="text-link">Meet {settings.name.split(' ')[0]} <ArrowRight size={18} /></Link><div className="about-signature">{settings.name}<small>ARCHITECTURAL DESIGNER & BIM ARCHITECT</small></div></div></section>
  </>;
}
