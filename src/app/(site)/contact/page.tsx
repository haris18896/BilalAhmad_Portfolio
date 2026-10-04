import type { Metadata } from 'next';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { getPortfolio } from '@/lib/content';
export const metadata: Metadata = { title: 'Get in touch' };
export default async function Contact() {
  const { settings } = await getPortfolio();
  return <section className="contact-page section-pad"><p className="eyebrow">GOOD SPACES START WITH A CONVERSATION</p><h1>Let’s create<br /><span>something meaningful.</span></h1><div className="contact-grid"><p>Have a project in mind, a collaboration to explore, or simply a question? I’d love to hear from you.</p><div className="contact-options"><a href={`mailto:${settings.email}`}><Mail size={22} strokeWidth={1.2} /><div><span className="eyebrow">WRITE TO ME</span><span>{settings.email}</span></div><ArrowUpRight size={23} /></a>{settings.phone && <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}><Phone size={22} strokeWidth={1.2} /><div><span className="eyebrow">LET’S TALK</span><span>{settings.phone}</span></div><ArrowUpRight size={23} /></a>}<div className="contact-socials">{[{ title:'Behance',url:settings.behance },{ title:'LinkedIn',url:settings.linkedin },{ title:'Instagram',url:settings.instagram }].filter(s => s.url).map(s => <a href={s.url} key={s.title} target="_blank" rel="noreferrer">{s.title}<ArrowUpRight size={15} /></a>)}</div></div></div></section>;
}
