'use client';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import type { GalleryImage } from '@/lib/types';

export function ProjectGallery({ images, title, technical = false, material = false }: { images: GalleryImage[]; title: string; technical?: boolean; material?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  const move = (delta: number) => setIndex(i => (i+delta+images.length) % images.length);
  return <><div className={'project-gallery' + (technical ? ' drawing-gallery' : '') + (material ? ' material-gallery' : '')}>{images.map((image,i) => <figure key={image.url+i} data-reveal><button className="gallery-trigger" aria-label={'View ' + (image.caption || image.alt || title)} onClick={() => { setIndex(i); dialog.current?.showModal(); setOpen(true); }}><Image src={image.url} alt={image.alt || title} fill style={image.detailZoom ? { transform: "scale(" + image.detailZoom + ")", transformOrigin: (image.hotspot?.x ?? .5) * 100 + "% " + (image.hotspot?.y ?? .5) * 100 + "%" } : undefined} sizes="(max-width: 680px) 90vw, 45vw" /><span className="gallery-expand"><Expand size={18} /></span></button>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div>
  <dialog ref={dialog} className="gallery-dialog" aria-label={title + ' gallery'} onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } }}><button className="lightbox-close icon-button" aria-label="Close gallery" onClick={() => dialog.current?.close()}><X size={28} strokeWidth={1} /></button>{open && <div className="lightbox-content"><div className="lightbox-image" key={index}><Image src={images[index].url} alt={images[index].alt || title} fill sizes="90vw" /></div><div className="lightbox-caption"><p>{images[index].caption || images[index].alt || title}</p><span aria-live="polite">{index+1} / {images.length}</span></div>{images.length > 1 && <><button className="lightbox-prev icon-button" aria-label="Previous image" onClick={() => move(-1)}><ArrowLeft /></button><button className="lightbox-next icon-button" aria-label="Next image" onClick={() => move(1)}><ArrowRight /></button></>}</div>}</dialog></>;
}
