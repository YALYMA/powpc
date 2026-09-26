'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Affichage seul, a partir d'une moyenne reelle (peut etre decimale). */
export function StarRatingDisplay({
  average,
  size = 'sm'
}: {
  average: number;
  size?: 'sm' | 'md';
}) {
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => {
        const fill = Math.max(0, Math.min(1, average - index));
        return (
          <span key={index} className="relative inline-block">
            <Star className={cn(dimension, 'text-slate-200')} fill="currentColor" />
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn(dimension, 'text-amber-400')} fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/** Selecteur interactif pour le formulaire d'avis. */
export function StarRatingInput({
  value,
  onChange
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Votre note">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} etoile${star > 1 ? 's' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          className="rounded p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Star
            className={cn('h-7 w-7 transition-colors', star <= active ? 'text-amber-400' : 'text-slate-200')}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  );
}
