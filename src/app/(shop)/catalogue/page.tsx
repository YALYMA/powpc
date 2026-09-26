import type { Metadata } from 'next';
import { SearchBar } from '@/components/shop/search-bar';
import { CategoryTiles } from '@/components/shop/category-tiles';
import { ProductCard } from '@/components/shop/product-card';
import { getFeaturedProducts } from '@/services/product.service';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Batteries et chargeurs pour ordinateurs portables. Parcourez par categorie ou recherchez directement votre reference.'
};

export default async function CataloguePage() {
  const [batteries, chargers] = await Promise.all([
    getFeaturedProducts('BATTERIE', 4),
    getFeaturedProducts('CHARGEUR', 4)
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Catalogue</h1>
      <p className="mt-1 text-sm text-slate-600">
        Parcourez par categorie, ou recherchez directement une reference ou un modele de PC.
      </p>

      <div className="mt-6 max-w-2xl">
        <SearchBar size="md" />
      </div>

      <div className="mt-8">
        <CategoryTiles />
      </div>

      {batteries.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Batteries populaires</h2>
            <a href="/batteries" className="text-sm font-medium text-brand-600 hover:underline">
              Tout voir
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {batteries.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {chargers.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Chargeurs populaires</h2>
            <a href="/chargeurs" className="text-sm font-medium text-brand-600 hover:underline">
              Tout voir
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {chargers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
