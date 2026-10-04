import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Download } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
export const metadata: Metadata = { title: 'About' };
export default async function About() {
  const { settings } = await getPortfolio();
  return <section className="about-page section-pad"><div className="page-intro"><p className="eyebrow">THE PERSON BEHIND THE WORK</p><h1>Considered spaces.<br /><span>Human connections.</span></h1></div><div className="about-page-grid"><div className="portrait-wrap"><Image src={settings.portrait} alt={settings.name} fill priority sizes="(max-width: 700px) 100vw, 40vw" /></div><div className="about-page-copy"><p className="eyebrow">HELLO, I’M {settings.name.toUpperCase()}</p><h2>Designer by instinct.<br />Precise by practice.</h2><p>{settings.about}</p><p>My work spans architectural design, interiors, and Building Information Modeling. I bring a collaborative approach to every project, connecting design intent with the technical detail that makes it possible.</p><a className="button button-dark" href={settings.cvUrl} target="_blank" rel="noreferrer">Download my CV <Download size={16} /></a><Link className="text-link" href="/contact">Let’s connect <ArrowUpRight size={17} /></Link></div></div><section className="experience-section"><div><p className="eyebrow">THE JOURNEY SO FAR</p><h2>Experience<br />& education.</h2></div><div className="experience-list">{settings.experience.map((item,index) => <div className="experience-item" key={index}><span className="eyebrow">{item.period}</span><h3>{item.title}</h3><h4>{item.company}</h4><p>{item.description}</p></div>)}</div></section></section>;
}
