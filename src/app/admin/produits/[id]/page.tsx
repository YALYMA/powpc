import { notFound } from 'next/navigation';
import { ProductForm, type ProductFormInitial } from '@/components/admin/product-form';
import { getBrands, getCategories, getProductForEdit } from '@/services/catalog.service';
import { getAllLaptops } from '@/services/compatibility.service';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, brands, categories, laptops] = await Promise.all([
    getProductForEdit(id),
    getBrands(),
    getCategories(),
    getAllLaptops()
  ]);

  if (!product) notFound();

  const initial: ProductFormInitial = {
    id: product.id,
    name: product.name,
    reference: product.reference,
    description: product.description,
    brandId: product.brandId,
    categoryId: product.categoryId,
    priceXof: product.priceXof,
    comparePriceXof: product.comparePriceXof,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    status: product.status,
    isActive: product.isActive,
    kind: product.batterySpec ? 'BATTERIE' : 'CHARGEUR',
    imageUrls: product.images.map((img) => img.url),
    laptopIds: product.compatibilities.map((c) => c.laptopId),
    batterySpec: product.batterySpec,
    chargerSpec: product.chargerSpec
  };

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Modifier {product.name}</h1>
      <ProductForm
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name, type: c.type }))}
        laptops={laptops.map((l) => ({ id: l.id, label: `${l.brand.name} ${l.model}` }))}
        initial={initial}
      />
    </div>
  );
}
