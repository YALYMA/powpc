'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { StatusBadge } from '@/components/ui/badge';
import { formatXof, cn } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { useFavorites } from '@/components/favorites-provider';
import type { ProductCard as ProductCardType } from '@/services/product.service';

export function ProductCard({ product }: { product: ProductCardType }) {
  const { has, toggle, ready } = useFavorites();
  const isFavorite = ready && has(product.id);

  const image = product.images[0]?.url ?? PLACEHOLDER_IMAGE;
  const specLine = product.batterySpec
    ? [
        `${product.batterySpec.voltage} V`,
        product.batterySpec.capacityWh ? `${product.batterySpec.capacityWh} Wh` : null,
        product.batterySpec.cells ? `${product.batterySpec.cells} cellules` : null
      ]
        .filter(Boolean)
        .join(' · ')
    : product.chargerSpec
      ? [
          `${product.chargerSpec.watts} W`,
          `${product.chargerSpec.voltage} V`,
          product.chargerSpec.isUsbC ? 'USB-C' : product.chargerSpec.connector
        ].join(' · ')
      : null;

  const compat = product.compatibilities
    .map((c) => `${c.laptop.brand.name} ${c.laptop.model}`)
    .join(', ');

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:border-brand-200 hover:shadow-lg">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggle(product.id);
        }}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        aria-pressed={isFavorite}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm transition-colors hover:text-favorite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <Heart className={cn('h-4 w-4', isFavorite && 'fill-favorite text-favorite')} aria-hidden />
      </button>

      <Link
        href={`/produits/${product.slug}`}
        className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={product.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {product.brand.name}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-1 text-xs text-slate-500">Ref. {product.reference}</p>
          {specLine && <p className="mt-2 text-xs text-slate-600">{specLine}</p>}
          {compat && <p className="mt-1 line-clamp-1 text-xs text-slate-500">Compatible : {compat}</p>}

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <p className="text-lg font-semibold text-slate-900">{formatXof(product.priceXof)}</p>
              {product.comparePriceXof && product.comparePriceXof > product.priceXof && (
                <p className="text-xs text-slate-500 line-through">
                  {formatXof(product.comparePriceXof)}
                </p>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:underline">
              Voir details <span aria-hidden>&rarr;</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
