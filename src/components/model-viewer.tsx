'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, type ReactNode, useState, useEffect, useRef } from 'react';
import { RotateCcw, MoveUpRight, Maximize2 } from 'lucide-react';

const Scene = dynamic(() => import('./spatial-scene'), { ssr: false, loading: () => <div className="model-loading"><span /><p>Bringing space to life</p></div> });
export type ModelMode = 'exterior' | 'interior' | 'bim';

class ModelBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ModelFallback({ poster }: { poster?: string }) {
  return <div className="model-fallback">{poster ? <Image src={poster} alt="Architectural model reference" fill sizes="(max-width: 800px) 100vw, 65vw" /> : <svg viewBox="0 0 700 450" role="img" aria-label="Architectural pavilion illustration"><ellipse cx="380" cy="345" rx="280" ry="55" fill="#d8d6cd" /><path d="M150 280L410 360L635 235L375 155Z" fill="#c6c3b4" /><path d="M240 175L410 225L555 143L385 96Z" fill="#e4e1d4" stroke="#9b9e8c" /><path d="M240 175V286L410 337V225Z" fill="#b9b4a3" /><path d="M410 225V337L555 255V143Z" fill="#8e9a8d" opacity=".7" />{[280,325,370].map(x => <path key={x} d={`M${x} 190V300`} stroke="#5d6250" strokeWidth="4" />)}<path d="M205 132L405 191L590 89L389 29Z" fill="#efede5" stroke="#a9a997" /></svg>}<span className="fallback-label">Architectural preview · interactive 3D unavailable on this device</span></div>;
}

export function ModelViewer({ modelUrl, poster }: { modelUrl?: string; poster?: string }) {
  const [mode, setMode] = useState<ModelMode>('exterior');
  const [rotationKey, setRotationKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const hotspotButtons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (!fullscreen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    container.current?.querySelector<HTMLButtonElement>('.close-model')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
      if (event.key !== 'Tab') return;
      const focusable = container.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [fullscreen]);
  return <div ref={container} className={`model-viewer ${fullscreen ? 'model-expanded' : ''}`} role={fullscreen ? 'dialog' : undefined} aria-modal={fullscreen || undefined} aria-label="Interactive architectural model">
    <div className="model-topline"><span className="eyebrow">{modelUrl ? 'A CLOSER LOOK / 3D MODEL' : 'SPATIAL STUDY / INTERACTIVE MODEL'}</span><button className="icon-button" onClick={() => setFullscreen(!fullscreen)} aria-label={fullscreen ? 'Close expanded model' : 'Expand model'}><Maximize2 size={16} /></button></div>
    {fullscreen && <button className="close-model button" onClick={() => setFullscreen(false)}>Close view ×</button>}
    <div className="model-canvas" aria-label="Drag to orbit the architectural model">
      <ModelBoundary fallback={<ModelFallback poster={poster} />}>
        {failed ? <ModelFallback poster={poster} /> : <Scene key={rotationKey} mode={mode} modelUrl={modelUrl} hotspotButtons={hotspotButtons} onFailure={() => setFailed(true)} />}
      </ModelBoundary>
      {!modelUrl && !failed && <div className="scene-hotspots">{['architecture','interiors','BIM'].map((label,index) => <button key={label} ref={element => { hotspotButtons.current[index] = element; }} className="scene-hotspot" aria-label={`Explore ${label}`} onClick={() => setHotspot(index)}>0{index+1}</button>)}</div>}
      {hotspot !== null && !modelUrl && <div className="hotspot-card" aria-live="polite"><button aria-label="Close model detail" onClick={() => setHotspot(null)}>×</button><p className="eyebrow">0{hotspot + 1} / SPATIAL STUDY</p><h3>{['Architecture', 'Interiors', 'BIM'][hotspot]}</h3><p>{['A pavilion study exploring proportion, openness, and the relationship between built and natural space.', 'Warm timber, considered furnishings, and light define the experience within.', 'An exploded view reveals the relationship between structure, enclosure, and design intent.'][hotspot]}</p></div>}
    </div>
    <div className="model-controls">
      {!modelUrl && <div className="model-tabs" role="group" aria-label="Model view">{(['exterior', 'interior', 'bim'] as const).map(m => <button key={m} aria-pressed={mode === m} className={mode === m ? 'selected' : ''} disabled={failed} onClick={() => { setMode(m); setHotspot(null); }}>{m === 'bim' ? 'BIM layers' : m === 'interior' ? 'Interior' : 'Exterior'}</button>)}</div>}
      <span className="orbit-hint"><MoveUpRight size={14} /> Drag to explore</span>
      <button className="icon-button" aria-label="Reset model rotation" onClick={() => { setRotationKey(rotationKey + 1); setFailed(false); }}><RotateCcw size={15} /></button>
    </div>
    {!modelUrl && <div className="model-note">An interactive design study · explore real projects below</div>}
  </div>;
}
