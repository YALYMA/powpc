import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAdminProducts } from '@/services/catalog.service';
import { deleteProductAction, toggleProductActiveAction } from '@/actions/admin.actions';
import { ProductRowActions } from '@/components/admin/simple-forms';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatXof } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await getAdminProducts(q);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900">Produits</h1>
        <Link href="/admin/produits/nouveau">
          <Button size="sm">
            <Plus className="h-4 w-4" aria-hidden /> Nouveau produit
          </Button>
        </Link>
      </div>

      <form className="mt-5" action="/admin/produits">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom ou reference..."
          className="h-10 w-full max-w-sm rounded-xl border border-slate-300 px-3 text-sm focus:border-brand-500 focus:outline-none"
        />
      </form>

      <div className="mt-5 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Categorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Compat.</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Aucun produit.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className={product.isActive ? '' : 'opacity-50'}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.reference}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{product.category.name}</td>
                <td className="px-4 py-3 font-medium">{formatXof(product.priceXof)}</td>
                <td className="px-4 py-3">
                  <span className={product.stock <= product.lowStockThreshold ? 'text-amber-600' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{product._count.compatibilities}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/produits/${product.id}`}>
                      <Button size="sm" variant="outline">
                        Modifier
                      </Button>
                    </Link>
                    <ProductRowActions
                      id={product.id}
                      isActive={product.isActive}
                      onToggle={toggleProductActiveAction}
                      onDelete={deleteProductAction}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue carte pour mobile : la table ci-dessus force un defilement
          horizontal illisible sous md, une liste empilee est plus claire. */}
      <div className="mt-5 space-y-3 md:hidden">
        {products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Aucun produit.
          </p>
        )}
        {products.map((product) => (
          <div
            key={product.id}
            className={`rounded-2xl border border-slate-200 bg-white p-4 ${product.isActive ? '' : 'opacity-50'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">{product.reference}</p>
              </div>
              <StatusBadge status={product.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm">
              <dt className="text-slate-500">Categorie</dt>
              <dd className="text-right text-slate-700">{product.category.name}</dd>
              <dt className="text-slate-500">Prix</dt>
              <dd className="text-right font-medium">{formatXof(product.priceXof)}</dd>
              <dt className="text-slate-500">Stock</dt>
              <dd
                className={`text-right ${product.stock <= product.lowStockThreshold ? 'text-amber-600' : ''}`}
              >
                {product.stock}
              </dd>
              <dt className="text-slate-500">Compatibilites</dt>
              <dd className="text-right text-slate-700">{product._count.compatibilities}</dd>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <Link href={`/admin/produits/${product.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  Modifier
                </Button>
              </Link>
              <ProductRowActions
                id={product.id}
                isActive={product.isActive}
                onToggle={toggleProductActiveAction}
                onDelete={deleteProductAction}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
