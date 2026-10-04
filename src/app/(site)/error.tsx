'use client';
export default function SiteError({ reset }: { reset: () => void }) {
  return <section className="not-found section-pad"><p className="eyebrow">A MOMENTARY INTERRUPTION</p><h1>Let’s try<br />that again.</h1><p>This page couldn’t load. Please try again.</p><button className="button button-dark" onClick={reset}>Reload this view ↻</button></section>;
}
