import { ProductForm } from '@/components/admin/product-form';
import { getBrands, getCategories } from '@/services/catalog.service';
import { getAllLaptops } from '@/services/compatibility.service';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const [brands, categories, laptops] = await Promise.all([
    getBrands(),
    getCategories(),
    getAllLaptops()
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Nouveau produit</h1>
      <ProductForm
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name, type: c.type }))}
        laptops={laptops.map((l) => ({ id: l.id, label: `${l.brand.name} ${l.model}` }))}
      />
    </div>
  );
}
