import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { getPortfolio } from '@/lib/content';
import { categories } from '@/lib/types';
import { ModelViewer } from '@/components/model-viewer';
import { ProjectCard } from '@/components/project-card';

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
  const related = projects.filter(p => p.category === project.category && p._id !== project._id).slice(0,2);
  const images = project.gallery?.filter(image => image.url) || [];
  return <article className="project-page section-pad">
    <Link className="text-link project-back" href={`/work/${category.slug}`}><ArrowLeft size={16} /> {category.title}</Link>
    <div className="project-title"><p className="eyebrow">{category.title.toUpperCase()} / {project.year || 'SELECTED WORK'}</p><h1>{project.title}</h1><p>{project.summary}</p></div>
    <div className="project-cover"><Image src={project.cover} alt={project.coverAlt || project.title} fill priority sizes="100vw" /></div>
    <div className="project-details"><div className="project-facts">{[{ label: 'Discipline', value: category.title },{ label: 'Location', value: project.location },{ label: 'Year', value: project.year },{ label: 'Contribution', value: project.role }].filter(f => f.value).map(f => <div key={f.label}><span className="eyebrow">{f.label.toUpperCase()}</span><p>{f.value}</p></div>)}{project.tools?.length ? <div><span className="eyebrow">TOOLS & SERVICES</span><p>{project.tools.join(' · ')}</p></div> : null}</div><div className="project-story">{project.body?.length ? <PortableText value={project.body} components={{ marks: { link: ({ value, children }) => <a href={typeof value.href === 'string' && /^(https?:|mailto:)/i.test(value.href) ? value.href : '#'} target="_blank" rel="noreferrer">{children}</a> } }} /> : <><p className="eyebrow">PROJECT OVERVIEW</p><h2>{category.description}</h2><p>{project.summary}</p></>}{project.attachments?.length ? <div className="project-downloads">{project.attachments.filter(file => file.url).map(file => <a className="download-row" key={file.url} href={file.url} target="_blank" rel="noreferrer">{file.title}<Download size={18} /></a>)}</div> : null}{project.sourceUrl && <a className="text-link" href={project.sourceUrl} target="_blank" rel="noreferrer">View original project archive <ArrowUpRight size={16} /></a>}</div></div>
    {images.length > 0 && <div className="project-gallery">{images.map((image,index) => <figure key={image.url + index}><div className="gallery-image"><Image src={image.url} alt={image.alt || project.title} fill sizes="100vw" /></div>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>}
    {project.videoUrl && <section className="project-media"><p className="eyebrow">PROJECT WALKTHROUGH</p><video controls playsInline preload="metadata" poster={project.cover}><source src={project.videoUrl} />Your browser does not support this video. <a href={project.videoUrl}>Download the walkthrough.</a></video></section>}
    {project.modelUrl && <section className="project-media"><p className="eyebrow">EXPLORE IN THREE DIMENSIONS</p><div className="project-model"><ModelViewer modelUrl={project.modelUrl} poster={project.cover} /></div></section>}
    {related.length > 0 && <section className="related-projects"><div className="section-heading"><h2>Another perspective.</h2><Link className="text-link" href={`/work/${category.slug}`}>More {category.title.toLowerCase()} <ArrowUpRight size={16} /></Link></div><div className="archive-grid">{related.map(p => <ProjectCard key={p._id} project={p} />)}</div></section>}
  </article>;
}
