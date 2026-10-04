import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Download } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { Eyebrow, SectionHeading } from '@/components/editorial';
export const metadata: Metadata = { title: 'About' };
export default async function About() {
  const { settings } = await getPortfolio();
  const experience = settings.experience.filter(e => !/graduate|bsc|bachelor/i.test(e.title));
  const education = settings.education || settings.experience.filter(e => /graduate|bsc|bachelor/i.test(e.title));
  return <section className="about-page section-pad">
    <div className="profile-hero"><div className="profile-copy"><Eyebrow>MEET BILAL</Eyebrow><h1>Thoughtful spaces.<br />Precise thinking.</h1><p className="profile-introduction">I’m Bilal Ahmad, a BIM architect, architectural designer, and interior designer.</p><p>{settings.about}</p><a className="button" href={settings.cvUrl} target="_blank" rel="noreferrer">Download CV <Download size={20} strokeWidth={1.2} /></a></div><div className="profile-portrait"><Image src="/images/bilal-charcoal.png" alt="Portrait of Bilal Ahmad" fill loading="eager" fetchPriority="high" sizes="(max-width: 680px) 90vw, 40vw" /></div></div>
    <section className="timeline-section" data-reveal><SectionHeading title="Experience" /><div className="timeline">{experience.map((item,i) => <div className="timeline-item" key={i}><span className="timeline-date">{item.period}</span><div><h3>{item.company}</h3><h4>{item.title}</h4><p>{item.description}</p></div></div>)}</div></section>
    {education.length > 0 && <section className="timeline-section" data-reveal><SectionHeading title="Education" /><div className="timeline">{education.map((item,i) => <div className="timeline-item" key={i}><span className="timeline-date">{item.period}</span><div><h3>{item.title}</h3><h4>{item.company}</h4><p>{item.description}</p></div></div>)}</div></section>}
    <section className="approach-section" data-reveal><SectionHeading title="Design approach" /><div className="approach-grid">{[{ title: 'Context', description: 'Understanding place, people, and purpose before drawing the first line.' },{ title: 'Collaboration', description: 'Connecting ideas and disciplines through clear communication.' },{ title: 'Detail', description: 'Bringing care and precision to every stage of the design.' }].map((item,i) => <div key={item.title}><span className="discipline-number">{'0' + (i+1)}</span><h3>{item.title}</h3><p>{item.description}</p></div>)}</div><Link className="button" href="/work">View work <ArrowUpRight size={20} /></Link></section>
  </section>;
}
