'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Web Animations changes presentation without mutating React's hydrating DOM.
        animations.push(entry.target.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' }));
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) observer.observe(element);
    });
    const stop = () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
    reduced.addEventListener('change', stop);
    return () => { stop(); reduced.removeEventListener('change', stop); };
  }, [pathname]);
  return null;
}
