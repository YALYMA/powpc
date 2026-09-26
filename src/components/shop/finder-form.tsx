'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Brand = {
  id: string;
  name: string;
  laptops: Array<{ id: string; model: string; series: string | null }>;
};

export function FinderForm({
  brands,
  defaultBrandId,
  defaultLaptopId,
  defaultType
}: {
  brands: Brand[];
  defaultBrandId?: string;
  defaultLaptopId?: string;
  defaultType?: string;
}) {
  const router = useRouter();
  const [brandId, setBrandId] = React.useState(defaultBrandId ?? '');
  const [laptopId, setLaptopId] = React.useState(defaultLaptopId ?? '');
  const [type, setType] = React.useState(defaultType ?? '');

  const laptops = brands.find((b) => b.id === brandId)?.laptops ?? [];

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!laptopId) return;
    const params = new URLSearchParams({ laptop: laptopId });
    if (type) params.set('type', type);
    router.push(`/compatibilite?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Marque</label>
        <Select
          value={brandId}
          onChange={(e) => {
            setBrandId(e.target.value);
            setLaptopId('');
          }}
        >
          <option value="">Selectionner</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Modele</label>
        <Select value={laptopId} onChange={(e) => setLaptopId(e.target.value)} disabled={!brandId}>
          <option value="">{brandId ? 'Selectionner' : 'Choisir une marque'}</option>
          {laptops.map((laptop) => (
            <option key={laptop.id} value={laptop.id}>
              {laptop.model}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Type de produit</label>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Batterie et chargeur</option>
          <option value="BATTERIE">Batterie</option>
          <option value="CHARGEUR">Chargeur</option>
        </Select>
      </div>

      <Button type="submit" size="lg" disabled={!laptopId}>
        Verifier la compatibilite
      </Button>
    </form>
  );
}
