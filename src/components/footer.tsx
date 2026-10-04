'use client';
import { usePathname } from 'next/navigation';
import type { Settings } from '@/lib/types';
import { EnquiryStrip } from './editorial';
export function Footer({ settings }: { settings: Settings }) {
  const pathname = usePathname();
  return <><>{pathname !== '/contact' && <EnquiryStrip />}</><footer className="site-footer"><div className="footer-brand"><strong>{settings.name.toUpperCase()}</strong><small>ARCHITECTURE · INTERIORS · BIM</small></div><a className="footer-email" href={'mailto:' + settings.email}>{settings.email}</a><div className="footer-socials">{[{ title: 'Behance', url: settings.behance }, { title: 'LinkedIn', url: settings.linkedin }, { title: 'Instagram', url: settings.instagram }].filter(s => s.url).map(s => <a href={s.url} key={s.title} target="_blank" rel="noreferrer">{s.title}</a>)}</div></footer></>;
}
