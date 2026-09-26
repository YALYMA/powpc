'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input, Label, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createBrandAction, createLaptopAction, adjustStockAction } from '@/actions/admin.actions';

export function BrandForm() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const payload = Object.fromEntries(new FormData(form).entries());
        setError(null);
        startTransition(async () => {
          const result = await createBrandAction(payload);
          if (!result.ok) setError(result.error ?? 'Erreur');
          else {
            form.reset();
            router.refresh();
          }
        });
      }}
    >
      <div className="w-full sm:w-64">
        <Label htmlFor="brand-name">Nouvelle marque</Label>
        <Input id="brand-name" name="name" placeholder="HP, Dell..." required />
      </div>
      <Button type="submit" disabled={pending}>
        Ajouter
      </Button>
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </form>
  );
}

export function LaptopForm({ brands }: { brands: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <form
      className="grid gap-3 sm:grid-cols-4 sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const payload = Object.fromEntries(new FormData(form).entries());
        setError(null);
        startTransition(async () => {
          const result = await createLaptopAction(payload);
          if (!result.ok) setError(result.error ?? 'Erreur');
          else {
            form.reset();
            router.refresh();
          }
        });
      }}
    >
      <div>
        <Label htmlFor="laptop-brand">Marque</Label>
        <Select id="laptop-brand" name="brandId" required>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="laptop-model">Modele</Label>
        <Input id="laptop-model" name="model" placeholder="250 G7" required />
      </div>
      <div>
        <Label htmlFor="laptop-series">Serie (optionnel)</Label>
        <Input id="laptop-series" name="series" placeholder="250 Series" />
      </div>
      <Button type="submit" disabled={pending}>
        Ajouter le modele
      </Button>
      {error && <p className="text-xs text-red-600 sm:col-span-4">{error}</p>}
    </form>
  );
}

export function StockForm({ products }: { products: Array<{ id: string; label: string }> }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <form
      className="grid gap-3 sm:grid-cols-5 sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const payload = Object.fromEntries(new FormData(form).entries());
        setMessage(null);
        startTransition(async () => {
          const result = await adjustStockAction(payload);
          setMessage(result.ok ? 'Mouvement enregistre.' : (result.error ?? 'Erreur'));
          if (result.ok) {
            form.reset();
            router.refresh();
          }
        });
      }}
    >
      <div className="sm:col-span-2">
        <Label htmlFor="stock-product">Produit</Label>
        <Select id="stock-product" name="productId" required>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="stock-type">Type</Label>
        <Select id="stock-type" name="type" defaultValue="IN">
          <option value="IN">Entree</option>
          <option value="OUT">Sortie</option>
          <option value="ADJUSTMENT">Ajustement</option>
          <option value="RETURN">Retour</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="stock-quantity">Quantite</Label>
        <Input id="stock-quantity" name="quantity" type="number" min="1" defaultValue={1} required />
      </div>
      <Button type="submit" disabled={pending}>
        Enregistrer
      </Button>
      {message && <p className="text-xs text-slate-600 sm:col-span-5">{message}</p>}
    </form>
  );
}

export function ClientRowActions({
  id,
  isActive,
  onToggle
}: {
  id: string;
  isActive: boolean;
  onToggle: (id: string, isActive: boolean) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await onToggle(id, !isActive);
          router.refresh();
        })
      }
    >
      {isActive ? 'Desactiver' : 'Activer'}
    </Button>
  );
}

export function ProductRowActions({
  id,
  isActive,
  onToggle,
  onDelete
}: {
  id: string;
  isActive: boolean;
  onToggle: (id: string, isActive: boolean) => Promise<{ ok: boolean }>;
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await onToggle(id, !isActive);
            router.refresh();
          })
        }
      >
        {isActive ? 'Desactiver' : 'Activer'}
      </Button>
      <Button
        size="sm"
        variant="danger"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await onDelete(id);
            if (!result.ok) window.alert(result.error ?? 'Suppression impossible');
            router.refresh();
          })
        }
      >
        Supprimer
      </Button>
    </div>
  );
}
