'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/input';

type Brand = { id: string; name: string; slug: string };

export function CatalogFilters({
  brands,
  basePath,
  watts
}: {
  brands: Brand[];
  basePath: string;
  watts?: number[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    router.push(`${basePath}?${next.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Marque</label>
        <Select value={params.get('brand') ?? ''} onChange={(e) => update('brand', e.target.value)}>
          <option value="">Toutes les marques</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Disponibilite</label>
        <Select value={params.get('status') ?? ''} onChange={(e) => update('status', e.target.value)}>
          <option value="">Toutes</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="SUR_COMMANDE">Sur commande</option>
          <option value="INDISPONIBLE">Indisponible</option>
        </Select>
      </div>

      {watts && watts.length > 0 ? (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Puissance</label>
          <Select value={params.get('watts') ?? ''} onChange={(e) => update('watts', e.target.value)}>
            <option value="">Toutes</option>
            {watts.map((w) => (
              <option key={w} value={w}>
                {w} W
              </option>
            ))}
          </Select>
        </div>
      ) : (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Prix maximum</label>
          <Select value={params.get('maxPrice') ?? ''} onChange={(e) => update('maxPrice', e.target.value)}>
            <option value="">Sans limite</option>
            <option value="15000">15 000 FCFA</option>
            <option value="25000">25 000 FCFA</option>
            <option value="40000">40 000 FCFA</option>
            <option value="60000">60 000 FCFA</option>
          </Select>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-500">Reference / modele</label>
        <input
          defaultValue={params.get('q') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') update('q', (e.target as HTMLInputElement).value);
          }}
          placeholder="HT03XL, 250 G7..."
          className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>
    </div>
  );
}
