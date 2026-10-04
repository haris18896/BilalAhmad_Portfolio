'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [{ href: '/work', label: 'Work' }, { href: '/about', label: 'About' }, { href: '/expertise', label: 'Expertise' }, { href: '/contact', label: 'Contact' }];
export function Brand() {
  return <Link href="/" className="brand" aria-label="Bilal Ahmad home"><span className="brand-mark">BA</span><span className="brand-name">BILAL AHMAD<small>ARCHITECTURE · INTERIORS · BIM</small></span></Link>;
}
export function Header() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const close = () => { dialog.current?.close(); setOpen(false); };
  const active = (href: string) => href === '/work' ? pathname.startsWith('/work') || pathname.startsWith('/projects') : pathname === href;
  return <header className="site-header">
    <Brand />
    <nav className="navigation" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined}>{link.label}</Link>)}<span className="nav-rule" aria-hidden="true" /></nav>
    <button className="menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Menu size={28} strokeWidth={1} /></button>
    <dialog ref={dialog} id="mobile-navigation" className="mobile-menu" aria-label="Main navigation" onClose={() => setOpen(false)}>
      <div className="mobile-menu-top"><Brand /><button className="icon-button" aria-label="Close navigation" onClick={close}><X size={28} strokeWidth={1} /></button></div>
      <nav aria-label="Mobile navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined} onClick={close}>{link.label}</Link>)}</nav>
      <p className="eyebrow">DESIGNING A BETTER BUILT ENVIRONMENT</p>
    </dialog>
  </header>;
}
