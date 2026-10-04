import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Box, Users, Layers } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { categories } from '@/lib/types';
import { Eyebrow, SectionHeading } from '@/components/editorial';
export const metadata: Metadata = { title: 'Expertise' };
export default async function Expertise() {
  const { projects } = await getPortfolio();
  return <section className="expertise-page section-pad"><div className="page-intro"><Eyebrow>DESIGNING A BETTER BUILT ENVIRONMENT</Eyebrow><h1>From concept<br />to coordination.</h1><p className="page-subtitle">Architecture · Interiors · BIM</p><p className="intro-description">An integrated approach to design, documentation, and delivery. Thoughtful spaces, built for a better tomorrow.</p></div><div className="expertise-rows">{categories.map(c => { const project = projects.find(p => p.category === c.slug); return <section key={c.slug} className="expertise-row" data-reveal><div className="expertise-label"><span className="discipline-number">{c.number}</span><h2>{c.title}</h2></div>{project && <Link href={'/work/' + c.slug} className="expertise-image"><Image src={project.cover} alt={project.coverAlt || project.title} fill sizes="(max-width: 680px) 90vw, 35vw" /></Link>}<div className="expertise-copy"><h3>{c.description}</h3><p>{c.detail}</p><p className="eyebrow">SERVICES</p><ul>{c.services.map(s => <li key={s}>{s}</li>)}</ul><Link className="button" href={'/work/' + c.slug}>View related work <ArrowUpRight size={20} /></Link></div></section>; })}</div><section className="tools-section" data-reveal><SectionHeading title="Tools I work with" /><div className="expertise-summary tools-summary">{[{ title: 'Design', tools: 'Revit · AutoCAD · SketchUp', icon: Box },{ title: 'Coordination', tools: 'Navisworks', icon: Users },{ title: 'Visualization', tools: 'Lumion · Enscape · D5 Render', icon: Layers }].map(t => <div key={t.title}><t.icon size={44} strokeWidth={1} /><div><h3>{t.title}</h3><p>{t.tools}</p></div></div>)}</div></section></section>;
}
