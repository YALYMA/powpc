import { getAllLaptops } from '@/services/compatibility.service';
import { getBrands } from '@/services/catalog.service';
import { LaptopForm } from '@/components/admin/simple-forms';

export const dynamic = 'force-dynamic';

export default async function AdminLaptopsPage() {
  const [laptops, brands] = await Promise.all([getAllLaptops(), getBrands()]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Modeles PC</h1>
      <p className="mt-1 text-sm text-slate-600">
        Chaque modele ajoute ici devient selectionnable dans le finder de compatibilite.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <LaptopForm brands={brands.map((b) => ({ id: b.id, name: b.name }))} />
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white md:block">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Marque</th>
              <th className="px-4 py-3">Modele</th>
              <th className="px-4 py-3">Serie</th>
              <th className="px-4 py-3">Produits compatibles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {laptops.map((laptop) => (
              <tr key={laptop.id}>
                <td className="px-4 py-3 text-slate-600">{laptop.brand.name}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{laptop.model}</td>
                <td className="px-4 py-3 text-slate-500">{laptop.series ?? '-'}</td>
                <td className="px-4 py-3">{laptop._count.compatibilities}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2 md:hidden">
        {laptops.map((laptop) => (
          <div
            key={laptop.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">
                {laptop.brand.name} {laptop.model}
              </p>
              <p className="text-xs text-slate-500">{laptop.series ?? 'Sans serie'}</p>
            </div>
            <span className="text-sm text-slate-600">{laptop._count.compatibilities} produit(s)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
