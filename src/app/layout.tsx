import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Bilal Ahmad — Architecture, Interiors & BIM', template: '%s — Bilal Ahmad' },
  description: 'The portfolio of Bilal Ahmad. Architectural design, thoughtful interiors, and coordinated BIM — from concept to the finest detail.',
  openGraph: { type: 'website', siteName: 'Bilal Ahmad', images: [{ url: '/images/bilal-charcoal.png', width: 896, height: 1195, alt: 'Bilal Ahmad' }] },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body id="top">{children}</body></html>;
}
