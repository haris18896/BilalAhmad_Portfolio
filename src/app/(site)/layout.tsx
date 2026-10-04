import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ContentRefresh } from '@/components/content-refresh';
import { getPortfolio } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getPortfolio();
  return <div className="site-shell"><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer settings={settings} /><ContentRefresh /></div>;
}
