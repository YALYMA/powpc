import type { Metadata } from 'next';
import { FinderForm } from '@/components/shop/finder-form';
import { ProductCard } from '@/components/shop/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { getBrandsWithLaptops, findCompatibleProducts, getLaptop } from '@/services/compatibility.service';
import type { CategoryType } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Verifier la compatibilite',
  description:
    'Selectionnez la marque et le modele de votre ordinateur portable pour voir les batteries et chargeurs compatibles.'
};

export default async function CompatibilitePage({
  searchParams
}: {
  searchParams: Promise<{ laptop?: string; type?: string }>;
}) {
  const { laptop: laptopId, type } = await searchParams;
  const brands = await getBrandsWithLaptops();

  const laptop = laptopId ? await getLaptop(laptopId) : null;
  const products = laptop
    ? await findCompatibleProducts(
        laptop.id,
        type === 'BATTERIE' || type === 'CHARGEUR' ? (type as CategoryType) : undefined
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Trouvez le produit compatible avec votre PC
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Pas besoin de connaitre la reference de votre batterie : le modele de votre ordinateur
          suffit.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <FinderForm
          brands={brands}
          defaultBrandId={laptop?.brandId}
          defaultLaptopId={laptop?.id}
          defaultType={type}
        />
      </div>

      {laptop && (
        <section className="mt-10">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Produits compatibles avec {laptop.brand.name} {laptop.model}
          </h2>

          {products.length === 0 ? (
            <EmptyState
              title="Aucun produit compatible enregistre pour ce modele"
              description="Envoyez-nous une demande : nous recherchons la piece aupres de nos fournisseurs et vous recontactons."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
