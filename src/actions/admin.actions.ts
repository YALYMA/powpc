'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import {
  brandSchema,
  createProductSchema,
  laptopSchema,
  stockAdjustmentSchema,
  updateProductSchema
} from '@/schemas/product.schema';
import {
  createBrand,
  createLaptop,
  createProduct,
  deleteProduct,
  setCompatibilities,
  toggleProductActive,
  updateProduct
} from '@/services/catalog.service';
import { adjustStock } from '@/services/stock.service';

export async function createProductAction(raw: unknown) {
  await requireAdmin();
  const parsed = createProductSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: 'Formulaire invalide',
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const product = await createProduct(parsed.data);
    revalidatePath('/admin/produits');
    revalidatePath('/batteries');
    revalidatePath('/chargeurs');
    return { ok: true as const, slug: product.slug };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error && error.message.includes('Unique')
          ? 'Cette reference existe deja.'
          : 'Creation impossible.'
    };
  }
}

export async function updateProductAction(raw: unknown) {
  await requireAdmin();
  const parsed = updateProductSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: 'Formulaire invalide',
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    const { id, ...rest } = parsed.data;
    await updateProduct(id, rest);
    revalidatePath('/admin/produits');
    revalidatePath('/batteries');
    revalidatePath('/chargeurs');
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error && error.message.includes('Unique')
          ? 'Cette reference existe deja.'
          : 'Modification impossible.'
    };
  }
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  await requireAdmin();
  await toggleProductActive(id, isActive);
  revalidatePath('/admin/produits');
  return { ok: true as const };
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  try {
    await deleteProduct(id);
    revalidatePath('/admin/produits');
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: 'Produit lie a des commandes : desactivez-le plutot.' };
  }
}

export async function setCompatibilitiesAction(productId: string, laptopIds: string[]) {
  await requireAdmin();
  await setCompatibilities(productId, laptopIds);
  revalidatePath('/admin/produits');
  revalidatePath('/compatibilite');
  return { ok: true as const };
}

export async function adjustStockAction(raw: unknown) {
  await requireAdmin();
  const parsed = stockAdjustmentSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: 'Donnees invalides' };

  await adjustStock(parsed.data);
  revalidatePath('/admin/stock');
  revalidatePath('/admin/produits');
  return { ok: true as const };
}

export async function getCloudinarySignatureAction(folder: string) {
  await requireAdmin();
  const { isCloudinaryConfigured, signCloudinaryUpload } = await import('@/lib/cloudinary');

  if (!isCloudinaryConfigured()) {
    return { ok: false as const, error: 'Cloudinary non configure (variables CLOUDINARY_* manquantes).' };
  }

  const safeFolder = `powerpc/${folder.replace(/[^a-z0-9_-]/gi, '')}`;
  const { signature, timestamp, cloudName, apiKey } = signCloudinaryUpload({ folder: safeFolder });

  return { ok: true as const, signature, timestamp, cloudName, apiKey, folder: safeFolder };
}

export async function toggleClientActiveAction(id: string, isActive: boolean) {
  await requireAdmin();
  const { toggleClientActive } = await import('@/services/customer.service');
  await toggleClientActive(id, isActive);
  revalidatePath('/admin/clients');
  return { ok: true as const };
}

export async function createBrandAction(raw: unknown) {
  await requireAdmin();
  const parsed = brandSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: 'Nom invalide' };

  try {
    await createBrand(parsed.data.name);
    revalidatePath('/admin/marques');
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: 'Cette marque existe deja.' };
  }
}

export async function createLaptopAction(raw: unknown) {
  await requireAdmin();
  const parsed = laptopSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: 'Formulaire invalide' };

  try {
    await createLaptop(parsed.data);
    revalidatePath('/admin/laptops');
    revalidatePath('/compatibilite');
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: 'Ce modele existe deja pour cette marque.' };
  }
}
