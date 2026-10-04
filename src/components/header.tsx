'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [{ href: '/work', label: 'Work' }, { href: '/about', label: 'About' }, { href: '/#expertise', label: 'Expertise' }, { href: '/contact', label: 'Contact' }];
  return <header className="site-header">
    <Link href="/" className="brand" aria-label="Bilal Ahmad home" onClick={() => setOpen(false)}>
      <span className="brand-mark">B<span>A</span></span>
      <span className="brand-name">BILAL AHMAD<small>ARCHITECTURE · INTERIORS · BIM</small></span>
    </Link>
    <button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="main-nav" aria-label="Main navigation" className={open ? 'navigation is-open' : 'navigation'}>
      {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={(link.href === '/work' ? pathname.startsWith('/work') || pathname.startsWith('/projects') : pathname === link.href) ? 'active' : ''}>{link.label}</Link>)}
      <Link href="/contact" className="nav-cta" onClick={() => setOpen(false)}>Let’s talk <ArrowUpRight size={15} /></Link>
    </nav>
  </header>;
}
