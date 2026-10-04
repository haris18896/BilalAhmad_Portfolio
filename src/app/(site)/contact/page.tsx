import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Mail, Phone } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
import { Eyebrow } from '@/components/editorial';
import { EnquiryForm } from '@/components/enquiry-form';
export const metadata: Metadata = { title: 'Contact' };
export default async function Contact() {
  const { settings, projects } = await getPortfolio();
  const project = projects.find(p => p.category === 'interiors');
  return <section className="contact-page section-pad"><div className="contact-grid"><div className="contact-copy"><Eyebrow>DESIGNING A BETTER BUILT ENVIRONMENT</Eyebrow><h1>Let’s create<br />something<br />considered.</h1><p>Thoughtful spaces begin with a conversation. Share your ideas, and let’s explore how to bring them to life.</p><div className="contact-options"><h2>Start a conversation</h2><a href={'mailto:' + settings.email}><Mail size={28} strokeWidth={1.2} /><span>{settings.email}</span><ArrowRight size={24} strokeWidth={1} /></a>{settings.phone && <a href={'tel:' + settings.phone.replace(/[^+\d]/g,'')}><Phone size={28} strokeWidth={1.2} /><span>{settings.phone}</span><ArrowRight size={24} strokeWidth={1} /></a>}<div className="contact-socials">{[{title:'Behance',url:settings.behance},{title:'LinkedIn',url:settings.linkedin},{title:'Instagram',url:settings.instagram}].filter(s => s.url).map(s => <a key={s.title} href={s.url} target="_blank" rel="noreferrer">{s.title}<ArrowUpRight size={17} /></a>)}</div></div></div><EnquiryForm email={settings.email} /></div>{project && <div className="contact-image" data-reveal><Image src={project.cover} alt={project.coverAlt || project.title} fill sizes="95vw" /></div>}</section>;
}
