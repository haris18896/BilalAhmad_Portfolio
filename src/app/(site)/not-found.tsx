import Link from 'next/link';
export default function NotFound() {
  return <section className="not-found section-pad"><p className="eyebrow">404 / A DIFFERENT PATH</p><h1>This space<br />is yet to be built.</h1><p>The page you’re looking for couldn’t be found.</p><Link className="button button-dark" href="/work">Explore the work ↗</Link></section>;
}
