import { getBrands } from '@/services/catalog.service';
import { BrandForm } from '@/components/admin/simple-forms';

export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Marques</h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <BrandForm />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">{brand.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              {brand._count.products} produit(s) · {brand._count.laptops} modele(s) PC
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
