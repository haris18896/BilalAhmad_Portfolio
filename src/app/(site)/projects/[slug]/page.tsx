import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, Download } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { getPortfolio } from '@/lib/content';
import { categories } from '@/lib/types';
import { ProjectGallery } from '@/components/project-gallery';
import { SectionHeading, Eyebrow } from '@/components/editorial';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getPortfolio();
  const project = projects.find(p => p.slug === slug);
  return project ? { title: project.title, description: project.summary, openGraph: { images: [{ url: project.cover }] } } : { title: 'Project not found' };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { projects } = await getPortfolio();
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();
  const category = categories.find(c => c.slug === project.category)!;
  const next = projects.find(p => p.category === project.category && p._id !== project._id) || projects.find(p => p._id !== project._id);
  const images = project.gallery?.filter(i => i.url && i.kind !== 'drawing' && i.kind !== 'material') || [];
  const drawings = project.gallery?.filter(i => i.url && i.kind === 'drawing') || [];
  const materials = project.gallery?.filter(i => i.url && i.kind === 'material') || [];
  const files = project.attachments?.filter(f => f.url) || [];
  return <article className={'project-page section-pad ' + project.category}>
    <div className="project-top"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/work">Work</Link><span>/</span><Link href={'/work/' + category.slug}>{category.title}</Link><span>/</span><span aria-current="page">{project.title}</span></nav><nav className="project-anchors" aria-label="Project sections"><a href="#overview">Overview</a>{images.length > 0 && <a href="#gallery">Gallery</a>}{drawings.length > 0 && <a href="#drawings">Drawings</a>}{files.length > 0 && <a href="#downloads">Downloads</a>}</nav></div>
    <div className="project-title"><h1>{project.title}</h1><p>{project.projectType || project.role || category.title}{project.location && ' · ' + project.location}</p></div>
    <div className="project-cover"><Image src={project.cover} alt={project.coverAlt || project.title} fill loading="eager" fetchPriority="high" sizes="95vw" /></div>
    <dl className="project-facts">{[{ label: 'Project type', value: project.projectType || category.title },{ label: 'Location', value: project.location },{ label: 'Studio', value: project.studio },{ label: 'Year', value: project.year },{ label: 'Contribution', value: project.role }].filter(f => f.value).map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
    <section id="overview" className="project-overview" data-reveal><div className="project-story"><Eyebrow>PROJECT OVERVIEW</Eyebrow><h2>{project.storyTitle || (project.category === 'architecture' ? 'A considered approach.' : category.description)}</h2>{project.body?.length ? <PortableText value={project.body} components={{ marks: { link: ({ value, children }) => <a href={typeof value.href === 'string' && /^(https?:|mailto:)/i.test(value.href) ? value.href : '#'} target="_blank" rel="noreferrer">{children}</a> } }} /> : <p>{project.summary}</p>}</div><div className="overview-side"><div className="overview-image"><Image src={project.cover} alt={project.coverAlt || project.title} fill sizes="(max-width: 680px) 90vw, 30vw" /></div><p className="editorial-aside">Architecture,<br />interiors,<br />and digital craft.</p>{project.tools?.length ? <div><p className="eyebrow">TOOLS & SERVICES</p><p>{project.tools.join(' · ')}</p></div> : null}</div></section>
    {images.length > 0 && <section id="gallery" className="project-media-section"><SectionHeading title="Selected views" /><ProjectGallery images={images} title={project.title} /></section>}
    {drawings.length > 0 && <section id="drawings" className="project-media-section"><SectionHeading title="Drawings & documentation" /><ProjectGallery images={drawings} title={project.title} technical /></section>}
    {materials.length > 0 && <section className="project-media-section"><SectionHeading title="Material & detail" /><ProjectGallery images={materials} title={project.title} material /></section>}
    {files.length > 0 && <section id="downloads" className="project-downloads"><SectionHeading title="Project files" /><div>{files.map(f => <a className="button" key={f.url} href={f.url} target="_blank" rel="noreferrer">{f.title}<Download size={20} strokeWidth={1.2} /></a>)}</div></section>}
    {project.videoUrl && <section className="project-media-section"><SectionHeading title="Project walkthrough" /><video controls playsInline preload="none" poster={project.videoPoster || project.cover}><source src={project.videoUrl} />Your browser does not support video. <a href={project.videoUrl}>Download the walkthrough</a>.</video></section>}
    {next && <section className="next-project" data-reveal><SectionHeading title="Next project" /><Link href={'/projects/' + next.slug}><div className="next-project-image"><Image src={next.cover} alt={next.coverAlt || next.title} fill sizes="(max-width: 680px) 40vw, 30vw" /></div><div><h3>{next.title}</h3><p>{categories.find(c => c.slug === next.category)?.title}</p></div><ArrowRight size={28} strokeWidth={1} /></Link></section>}
  </article>;
}
