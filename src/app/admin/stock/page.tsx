import { getAdminProducts } from '@/services/catalog.service';
import { getMovements } from '@/services/stock.service';
import { StockForm } from '@/components/admin/simple-forms';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TYPE_LABEL: Record<string, string> = {
  IN: 'Entree',
  OUT: 'Sortie',
  ADJUSTMENT: 'Ajustement',
  RETURN: 'Retour'
};

export default async function AdminStockPage() {
  const [products, movements] = await Promise.all([getAdminProducts(), getMovements()]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Stock</h1>
      <p className="mt-1 text-sm text-slate-600">
        Chaque variation est tracee : on sait toujours pourquoi le stock a bouge.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <StockForm
          products={products.map((p) => ({
            id: p.id,
            label: `${p.name} (${p.reference}) — stock ${p.stock}`
          }))}
        />
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Quantite</th>
              <th className="px-4 py-3">Motif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Aucun mouvement enregistre.
                </td>
              </tr>
            )}
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td className="px-4 py-3 text-slate-500">{formatDate(movement.createdAt)}</td>
                <td className="px-4 py-3 text-slate-900">
                  {movement.product.name}
                  <span className="ml-2 text-xs text-slate-500">{movement.product.reference}</span>
                </td>
                <td className="px-4 py-3">{TYPE_LABEL[movement.type]}</td>
                <td className="px-4 py-3 font-medium">{movement.quantity}</td>
                <td className="px-4 py-3 text-slate-500">{movement.reason ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2 md:hidden">
        {movements.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Aucun mouvement enregistre.
          </p>
        )}
        {movements.map((movement) => (
          <div key={movement.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900">{movement.product.name}</p>
              <span className="text-sm font-semibold text-slate-900">{movement.quantity}</span>
            </div>
            <p className="text-xs text-slate-500">
              {movement.product.reference} · {TYPE_LABEL[movement.type]} · {formatDate(movement.createdAt)}
            </p>
            {movement.reason && <p className="mt-1 text-xs text-slate-500">{movement.reason}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
