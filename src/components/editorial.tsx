import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Box, Armchair, Layers } from 'lucide-react';
import { categories, type Category } from '@/lib/types';

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span className="tiny-line" aria-hidden="true" />{children}</p>;
}
export function SectionHeading({ title, href, linkText }: { title: string; href?: string; linkText?: string }) {
  return <div className="section-heading"><h2>{title}</h2><span className="heading-rule" aria-hidden="true" />{href && <Link className="text-link" href={href}>{linkText || 'View all work'}<ArrowRight size={20} strokeWidth={1.3} /></Link>}</div>;
}
export function DisciplineNav({ active, all = false }: { active?: Category; all?: boolean }) {
  return <nav className={'discipline-nav' + (all ? ' filter-nav' : '')} aria-label="Project disciplines">
    {all && <Link href="/work" aria-current={!active ? 'page' : undefined}>All</Link>}
    {categories.map(c => <Link key={c.slug} href={'/work/' + c.slug} aria-current={active === c.slug ? 'page' : undefined}>{!all && <span className="discipline-number">{c.number}</span>}{c.title}<span className="discipline-rule" aria-hidden="true" /></Link>)}
  </nav>;
}
export function EnquiryStrip() {
  return <section className="enquiry-strip"><div className="enquiry-inner"><div><Eyebrow>LET’S BUILD A BETTER TOMORROW</Eyebrow><h2>Have a project in mind?</h2></div><Link href="/contact" className="button">Let’s talk <ArrowUpRight size={24} strokeWidth={1.3} /></Link></div></section>;
}
export function ExpertiseSummary() {
  const icons = [Box, Armchair, Layers];
  return <div className="expertise-summary">{categories.map((c,i) => { const Icon = icons[i]; return <Link href={'/work/' + c.slug} key={c.slug}><Icon size={46} strokeWidth={1} /><div><h3>{c.title}</h3><p>{c.detail}</p></div><ArrowUpRight className="summary-arrow" size={18} /></Link>; })}</div>;
}
export function CrossDiscipline({ active }: { active?: Category }) {
  return <div className="cross-disciplines">{categories.filter(c => c.slug !== active).map(c => <Link key={c.slug} href={'/work/' + c.slug}><div><h3>Explore {c.title}</h3><p>{c.description}</p></div><ArrowRight size={26} strokeWidth={1} /></Link>)}</div>;
}
