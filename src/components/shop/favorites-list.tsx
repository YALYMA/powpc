'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/components/favorites-provider';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';
import type { ProductCard as ProductCardType } from '@/services/product.service';

export function FavoritesList() {
  const { ids, ready } = useFavorites();
  const [products, setProducts] = React.useState<ProductCardType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!ready) return;
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/favorites?ids=${ids.join(',')}`)
      .then((res) => res.json())
      .then((data: { products: ProductCardType[] }) => {
        if (!cancelled) setProducts(data.products);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ids, ready]);

  if (!ready || loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <Heart className="mb-3 h-8 w-8 text-slate-400" aria-hidden />
        <h2 className="text-base font-semibold text-slate-900">Aucun favori pour le moment</h2>
        <p className="mt-1 text-sm text-slate-600">
          Touchez le cœur sur un produit pour le retrouver ici rapidement.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/batteries">
            <Button>Voir les batteries</Button>
          </Link>
          <Link href="/chargeurs">
            <Button variant="outline">Voir les chargeurs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
