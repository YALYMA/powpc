import type { Metadata } from 'next';
import { CatalogFilters } from '@/components/shop/catalog-filters';
import { ProductCard } from '@/components/shop/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/shop/pagination';
import { getBrandsForFilter, getWattOptions, searchProducts } from '@/services/product.service';
import { parseSearchParams } from '@/schemas/product.schema';

export const metadata: Metadata = {
  title: 'Chargeurs PC compatibles',
  description:
    'Chargeurs 45W, 65W, 90W, USB-C pour ordinateurs portables. Verifiez la compatibilite avec votre modele. Livraison au Senegal.'
};

export default async function ChargeursPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = parseSearchParams(raw, { category: 'CHARGEUR' });
  const [{ items, total, page, pageCount }, brands, watts] = await Promise.all([
    searchProducts(parsed),
    getBrandsForFilter(),
    getWattOptions()
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chargeurs PC</h1>
        <p className="mt-1 text-sm text-slate-600">
          {total} produit{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''} au catalogue.
        </p>
      </header>

      <CatalogFilters brands={brands} basePath="/chargeurs" watts={watts} />

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            title="Aucun chargeur ne correspond a votre recherche"
            description="Precisez la puissance ou le modele de votre PC, ou demandez-nous le produit."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Pagination page={page} pageCount={pageCount} basePath="/chargeurs" />
    </div>
  );
}
