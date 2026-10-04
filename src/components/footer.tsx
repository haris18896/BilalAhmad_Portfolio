import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Settings } from '@/lib/types';

export function Footer({ settings }: { settings: Settings }) {
  return <footer className="site-footer">
    <div className="footer-top">
      <div><p className="eyebrow">HAVE SOMETHING IN MIND?</p><Link className="footer-heading" href="/contact">Let’s make<br />space for it. <ArrowUpRight strokeWidth={1} /></Link></div>
      <div className="footer-links"><a href={`mailto:${settings.email}`}>{settings.email} <ArrowUpRight size={15} /></a><div>{settings.behance && <a href={settings.behance} target="_blank" rel="noreferrer">Behance</a>}{settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}{settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram</a>}</div></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.name}</span><span>THOUGHTFULLY DESIGNED. PRECISELY BUILT.</span><a href="#top">Back to top ↑</a></div>
  </footer>;
}
