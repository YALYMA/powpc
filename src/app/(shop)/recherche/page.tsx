import type { Metadata } from 'next';
import { SearchBar } from '@/components/shop/search-bar';
import { ProductCard } from '@/components/shop/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/shop/pagination';
import { searchProducts } from '@/services/product.service';
import { parseSearchParams } from '@/schemas/product.schema';

export const metadata: Metadata = { title: 'Recherche', robots: { index: false } };

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = parseSearchParams(raw);
  const { items, total, page, pageCount } = await searchProducts(parsed);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <SearchBar size="md" />
      </div>

      <h1 className="mt-8 text-xl font-semibold text-slate-900">
        {total} resultat{total > 1 ? 's' : ''} {parsed.q ? `pour "${parsed.q}"` : ''}
      </h1>

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            title="Aucun produit trouve"
            description="Verifiez la reference ou le modele saisi. Vous pouvez aussi nous envoyer une demande, nous recherchons le produit pour vous."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Pagination page={page} pageCount={pageCount} basePath="/recherche" />
    </div>
  );
}
