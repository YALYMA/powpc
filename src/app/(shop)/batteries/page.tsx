import type { Metadata } from 'next';
import { CatalogFilters } from '@/components/shop/catalog-filters';
import { ProductCard } from '@/components/shop/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/shop/pagination';
import { getBrandsForFilter, searchProducts } from '@/services/product.service';
import { parseSearchParams } from '@/schemas/product.schema';

export const metadata: Metadata = {
  title: 'Batteries PC compatibles',
  description:
    'Catalogue de batteries pour ordinateurs portables HP, Dell, Lenovo, Asus, Acer. Prix en FCFA, stock en temps reel, livraison au Senegal.'
};

export default async function BatteriesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = parseSearchParams(raw, { category: 'BATTERIE' });
  const [{ items, total, page, pageCount }, brands] = await Promise.all([
    searchProducts(parsed),
    getBrandsForFilter()
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Batteries PC</h1>
        <p className="mt-1 text-sm text-slate-600">
          {total} produit{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''} au catalogue.
        </p>
      </header>

      <CatalogFilters brands={brands} basePath="/batteries" />

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            title="Aucune batterie ne correspond a votre recherche"
            description="Essayez une autre reference, ou demandez-nous directement le modele dont vous avez besoin."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Pagination page={page} pageCount={pageCount} basePath="/batteries" />
    </div>
  );
}
