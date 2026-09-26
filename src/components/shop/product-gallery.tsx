'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

type GalleryImage = { url: string; alt?: string | null };

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const list = images.length > 0 ? images : [{ url: PLACEHOLDER_IMAGE, alt: productName }];
  const [index, setIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);

  const active = list[index]!;

  function go(delta: number) {
    setIndex((current) => (current + delta + list.length) % list.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0]!.clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  return (
    <div>
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-0 cursor-zoom-in"
          aria-label="Agrandir l'image"
        >
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8"
          />
        </button>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Zoomer sur l'image"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Search className="h-4 w-4" aria-hidden />
        </button>

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Image precedente"
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-sm transition-opacity hover:bg-white focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-sm transition-opacity hover:bg-white focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>

            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-white">
              {index + 1}/{list.length}
            </span>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((image, i) => (
            <button
              key={image.url + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border bg-white transition',
                i === index ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <Image src={image.url} alt={image.alt ?? productName} fill className="object-contain p-1.5" />
              {i === index && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Search className="h-2.5 w-2.5" aria-hidden />
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={list}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setLightboxOpen(false)}
          productName={productName}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  productName
}: {
  images: GalleryImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  productName: string;
}) {
  const [zoomed, setZoomed] = React.useState(false);
  const [origin, setOrigin] = React.useState('center');
  const active = images[index]!;

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length);
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [index, images.length, onClose, onIndexChange]);

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin(`${x}% ${y}%`);
    }
    setZoomed((v) => !v);
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-white/70">
          {index + 1}/{images.length} — touchez l'image pour zoomer
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          onClick={handleImageClick}
          className={cn('relative h-full w-full', zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
        >
          <Image
            src={active.url}
            alt={active.alt ?? productName}
            fill
            sizes="100vw"
            className="object-contain transition-transform duration-300"
            style={{ transform: zoomed ? 'scale(2)' : 'scale(1)', transformOrigin: origin }}
          />
        </div>

        {images.length > 1 && !zoomed && (
          <>
            <button
              type="button"
              onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
              aria-label="Image precedente"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onIndexChange((index + 1) % images.length)}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
