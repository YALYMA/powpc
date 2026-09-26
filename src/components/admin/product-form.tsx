'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input, Label, Select, Textarea, FieldError } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploader } from './image-uploader';
import { createProductAction, updateProductAction } from '@/actions/admin.actions';

type Option = { id: string; name: string };
type LaptopOption = { id: string; label: string };

export type ProductFormInitial = {
  id: string;
  name: string;
  reference: string;
  description: string | null;
  brandId: string;
  categoryId: string;
  priceXof: number;
  comparePriceXof: number | null;
  stock: number;
  lowStockThreshold: number;
  status: 'DISPONIBLE' | 'SUR_COMMANDE' | 'INDISPONIBLE';
  isActive: boolean;
  kind: 'BATTERIE' | 'CHARGEUR';
  imageUrls: string[];
  laptopIds: string[];
  batterySpec?: {
    voltage: number;
    capacityMah: number | null;
    capacityWh: number | null;
    cells: number | null;
    chemistry: string | null;
    isInternal: boolean;
    warranty: string | null;
  } | null;
  chargerSpec?: {
    watts: number;
    voltage: number;
    amperage: number;
    connector: string;
    isUsbC: boolean;
    cableType: string | null;
    warranty: string | null;
  } | null;
};

export function ProductForm({
  brands,
  categories,
  laptops,
  initial
}: {
  brands: Option[];
  categories: Array<Option & { type: string }>;
  laptops: LaptopOption[];
  initial?: ProductFormInitial;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [kind, setKind] = React.useState<'BATTERIE' | 'CHARGEUR'>(initial?.kind ?? 'BATTERIE');
  const [selectedLaptops, setSelectedLaptops] = React.useState<string[]>(initial?.laptopIds ?? []);
  const [imageUrls, setImageUrls] = React.useState<string[]>(
    initial?.imageUrls.length ? initial.imageUrls : ['']
  );
  const [filter, setFilter] = React.useState('');
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [success, setSuccess] = React.useState(false);

  const categoryOptions = categories.filter((c) => c.type === kind);
  const visibleLaptops = laptops
    .filter((l) => l.label.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 40);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    const form = new FormData(event.currentTarget);

    const spec =
      kind === 'BATTERIE'
        ? {
            voltage: form.get('voltage'),
            capacityMah: form.get('capacityMah') || undefined,
            capacityWh: form.get('capacityWh') || undefined,
            cells: form.get('cells') || undefined,
            chemistry: form.get('chemistry') ?? '',
            isInternal: form.get('isInternal') === 'on',
            warranty: form.get('warranty') ?? ''
          }
        : {
            watts: form.get('watts'),
            voltage: form.get('voltage'),
            amperage: form.get('amperage'),
            connector: form.get('connector'),
            isUsbC: form.get('isUsbC') === 'on',
            cableType: form.get('cableType') ?? '',
            warranty: form.get('warranty') ?? ''
          };

    const payload = {
      ...(isEdit ? { id: initial!.id } : {}),
      kind,
      name: form.get('name'),
      reference: form.get('reference'),
      description: form.get('description') ?? '',
      brandId: form.get('brandId'),
      categoryId: form.get('categoryId'),
      priceXof: form.get('priceXof'),
      comparePriceXof: form.get('comparePriceXof') || undefined,
      stock: form.get('stock'),
      lowStockThreshold: form.get('lowStockThreshold') || 3,
      status: form.get('status'),
      isActive: form.get('isActive') === 'on',
      imageUrls: imageUrls.filter(Boolean),
      laptopIds: selectedLaptops,
      spec
    };

    startTransition(async () => {
      const result = isEdit ? await updateProductAction(payload) : await createProductAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        if ('fieldErrors' in result && result.fieldErrors) {
          setFieldErrors(result.fieldErrors as Record<string, string[]>);
        }
        return;
      }
      if (isEdit) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 2500);
      } else {
        router.push('/admin/produits');
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Type de produit</h2>
        <div className="flex gap-3">
          {(['BATTERIE', 'CHARGEUR'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                kind === value
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-slate-300 text-slate-600'
              }`}
            >
              {value === 'BATTERIE' ? 'Batterie' : 'Chargeur'}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Informations generales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input id="name" name="name" placeholder="Batterie HP HT03XL" defaultValue={initial?.name} required />
            <FieldError message={fieldErrors.name?.[0]} />
          </div>
          <div>
            <Label htmlFor="reference">Reference</Label>
            <Input id="reference" name="reference" placeholder="HT03XL" defaultValue={initial?.reference} required />
            <FieldError message={fieldErrors.reference?.[0]} />
          </div>
          <div>
            <Label htmlFor="brandId">Marque</Label>
            <Select id="brandId" name="brandId" defaultValue={initial?.brandId} required>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="categoryId">Categorie</Label>
            <Select id="categoryId" name="categoryId" defaultValue={initial?.categoryId} required>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select id="status" name="status" defaultValue={initial?.status ?? 'DISPONIBLE'}>
              <option value="DISPONIBLE">Disponible</option>
              <option value="SUR_COMMANDE">Sur commande</option>
              <option value="INDISPONIBLE">Indisponible</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="priceXof">Prix (FCFA)</Label>
            <Input id="priceXof" name="priceXof" type="number" min="0" defaultValue={initial?.priceXof} required />
            <FieldError message={fieldErrors.priceXof?.[0]} />
          </div>
          <div>
            <Label htmlFor="comparePriceXof">Prix barre (optionnel)</Label>
            <Input
              id="comparePriceXof"
              name="comparePriceXof"
              type="number"
              min="0"
              defaultValue={initial?.comparePriceXof ?? undefined}
            />
          </div>
          <div>
            <Label htmlFor="stock">
              Stock {isEdit && <span className="font-normal text-slate-400">(lecture seule ici)</span>}
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={initial?.stock ?? 0}
              readOnly={isEdit}
              aria-readonly={isEdit}
              className={isEdit ? 'bg-slate-50 text-slate-500' : undefined}
              required
            />
            {isEdit && (
              <p className="mt-1 text-xs text-slate-400">
                Modifiez le stock depuis la page Stock pour garder un historique des mouvements.
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lowStockThreshold">Seuil stock faible</Label>
            <Input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min="0"
              defaultValue={initial?.lowStockThreshold ?? 3}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={initial?.description ?? ''} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial?.isActive ?? true}
              className="h-4 w-4 rounded"
            />
            Produit actif (visible en boutique)
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Caracteristiques {kind === 'BATTERIE' ? 'batterie' : 'chargeur'}
        </h2>

        {kind === 'BATTERIE' ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="voltage">Tension (V)</Label>
              <Input
                id="voltage"
                name="voltage"
                type="number"
                step="0.1"
                defaultValue={initial?.batterySpec?.voltage ?? 11.55}
                required
              />
            </div>
            <div>
              <Label htmlFor="capacityMah">Capacite (mAh)</Label>
              <Input
                id="capacityMah"
                name="capacityMah"
                type="number"
                defaultValue={initial?.batterySpec?.capacityMah ?? undefined}
              />
            </div>
            <div>
              <Label htmlFor="capacityWh">Energie (Wh)</Label>
              <Input
                id="capacityWh"
                name="capacityWh"
                type="number"
                step="0.1"
                defaultValue={initial?.batterySpec?.capacityWh ?? undefined}
              />
            </div>
            <div>
              <Label htmlFor="cells">Cellules</Label>
              <Input
                id="cells"
                name="cells"
                type="number"
                min="0"
                max="12"
                defaultValue={initial?.batterySpec?.cells ?? undefined}
              />
            </div>
            <div>
              <Label htmlFor="chemistry">Chimie</Label>
              <Input id="chemistry" name="chemistry" defaultValue={initial?.batterySpec?.chemistry ?? 'Li-ion'} />
            </div>
            <div>
              <Label htmlFor="warranty">Garantie</Label>
              <Input
                id="warranty"
                name="warranty"
                placeholder="6 mois"
                defaultValue={initial?.batterySpec?.warranty ?? undefined}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isInternal"
                defaultChecked={initial?.batterySpec?.isInternal ?? true}
                className="h-4 w-4 rounded"
              />
              Batterie interne
            </label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="watts">Puissance (W)</Label>
              <Input
                id="watts"
                name="watts"
                type="number"
                defaultValue={initial?.chargerSpec?.watts ?? 65}
                required
              />
            </div>
            <div>
              <Label htmlFor="voltage">Tension (V)</Label>
              <Input
                id="voltage"
                name="voltage"
                type="number"
                step="0.1"
                defaultValue={initial?.chargerSpec?.voltage ?? 19.5}
                required
              />
            </div>
            <div>
              <Label htmlFor="amperage">Amperage (A)</Label>
              <Input
                id="amperage"
                name="amperage"
                type="number"
                step="0.01"
                defaultValue={initial?.chargerSpec?.amperage ?? 3.33}
                required
              />
            </div>
            <div>
              <Label htmlFor="connector">Connecteur</Label>
              <Input
                id="connector"
                name="connector"
                placeholder="4.5 x 3.0 mm"
                defaultValue={initial?.chargerSpec?.connector}
                required
              />
            </div>
            <div>
              <Label htmlFor="cableType">Type de cable</Label>
              <Input
                id="cableType"
                name="cableType"
                placeholder="Cable 3 broches"
                defaultValue={initial?.chargerSpec?.cableType ?? undefined}
              />
            </div>
            <div>
              <Label htmlFor="warranty">Garantie</Label>
              <Input
                id="warranty"
                name="warranty"
                placeholder="6 mois"
                defaultValue={initial?.chargerSpec?.warranty ?? undefined}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isUsbC"
                defaultChecked={initial?.chargerSpec?.isUsbC ?? false}
                className="h-4 w-4 rounded"
              />
              Connecteur USB-C
            </label>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Images</h2>
        <ImageUploader
          urls={imageUrls.filter(Boolean)}
          onChange={setImageUrls}
          folder="products"
          max={6}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-slate-900">Modeles PC compatibles</h2>
        <p className="mb-3 text-xs text-slate-500">
          {selectedLaptops.length} modele(s) selectionne(s). C'est ce qui alimente le finder.
        </p>
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer : HP 250..."
          className="mb-3"
        />
        <div className="grid max-h-64 gap-1 overflow-y-auto rounded-xl border border-slate-200 p-2 sm:grid-cols-2">
          {visibleLaptops.map((laptop) => (
            <label
              key={laptop.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={selectedLaptops.includes(laptop.id)}
                onChange={(e) =>
                  setSelectedLaptops((current) =>
                    e.target.checked
                      ? [...current, laptop.id]
                      : current.filter((id) => id !== laptop.id)
                  )
                }
              />
              {laptop.label}
            </label>
          ))}
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Produit mis a jour.
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Creer le produit'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
