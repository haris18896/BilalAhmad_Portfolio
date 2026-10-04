'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Refresh server content for visitors who keep the portfolio open while work is published.
export function ContentRefresh() {
  const router = useRouter();
  useEffect(() => {
    const interval = window.setInterval(() => { if (document.visibilityState === 'visible') router.refresh(); }, 60_000);
    const onVisible = () => { if (document.visibilityState === 'visible') router.refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', onVisible); };
  }, [router]);
  return null;
}
