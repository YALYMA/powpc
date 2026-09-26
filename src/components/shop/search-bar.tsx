'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Suggestion = {
  products: Array<{ name: string; slug: string; reference: string; priceXof: number }>;
  laptops: Array<{ id: string; model: string; slug: string; brand: { name: string } }>;
};

export function SearchBar({
  size = 'lg',
  hideButton = false
}: {
  size?: 'md' | 'lg';
  hideButton?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<Suggestion>({ products: [], laptops: [] });

  React.useEffect(() => {
    if (query.trim().length < 2) {
      setData({ products: [], laptops: [] });
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal
        });
        if (res.ok) setData((await res.json()) as Suggestion);
      } catch {
        // requete annulee
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  const hasResults = data.products.length > 0 || data.laptops.length > 0;

  return (
    <div className="relative w-full">
      <form onSubmit={submit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Rechercher un modele, une reference..."
            aria-label="Rechercher un produit"
            className={`w-full rounded-full border border-transparent bg-slate-100 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 ${
              size === 'lg' ? 'h-14 text-base' : 'h-11 text-sm'
            }`}
          />
          {loading && (
            <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          )}
        </div>
        <Button
          type="submit"
          size={size === 'lg' ? 'lg' : 'md'}
          className={hideButton ? 'sr-only' : 'shrink-0'}
        >
          Rechercher
        </Button>
      </form>

      {open && hasResults && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          {data.laptops.length > 0 && (
            <div className="border-b border-slate-100 p-2">
              <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                Modeles de PC
              </p>
              {data.laptops.map((laptop) => (
                <button
                  key={laptop.id}
                  type="button"
                  onMouseDown={() => router.push(`/compatibilite?laptop=${laptop.id}`)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {laptop.brand.name} {laptop.model}
                </button>
              ))}
            </div>
          )}
          {data.products.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                Produits
              </p>
              {data.products.map((product) => (
                <button
                  key={product.slug}
                  type="button"
                  onMouseDown={() => router.push(`/produits/${product.slug}`)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{product.reference}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
