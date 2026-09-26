import { z } from 'zod';

const baseProduct = {
  name: z.string().min(3, 'Nom trop court').max(140),
  reference: z.string().min(2, 'Reference requise').max(60),
  description: z.string().max(2000).optional().or(z.literal('')),
  brandId: z.string().min(1, 'Marque requise'),
  categoryId: z.string().min(1, 'Categorie requise'),
  priceXof: z.coerce.number().int().min(0, 'Prix invalide').max(100_000_000),
  comparePriceXof: z.coerce.number().int().min(0).max(100_000_000).optional(),
  stock: z.coerce.number().int().min(0).max(100_000),
  lowStockThreshold: z.coerce.number().int().min(0).max(1000).default(3),
  status: z.enum(['DISPONIBLE', 'SUR_COMMANDE', 'INDISPONIBLE']),
  isActive: z.coerce.boolean().default(true),
  imageUrls: z.array(z.string().min(1)).max(6).default([]),
  laptopIds: z.array(z.string().min(1)).max(200).default([])
};

export const batterySpecSchema = z.object({
  voltage: z.coerce.number().min(1).max(60),
  capacityMah: z.coerce.number().int().min(0).max(50_000).optional(),
  capacityWh: z.coerce.number().min(0).max(500).optional(),
  cells: z.coerce.number().int().min(0).max(12).optional(),
  chemistry: z.string().max(40).optional().or(z.literal('')),
  isInternal: z.coerce.boolean().default(true),
  warranty: z.string().max(60).optional().or(z.literal(''))
});

export const chargerSpecSchema = z.object({
  watts: z.coerce.number().int().min(5).max(500),
  voltage: z.coerce.number().min(1).max(60),
  amperage: z.coerce.number().min(0.1).max(30),
  connector: z.string().min(1, 'Connecteur requis').max(60),
  isUsbC: z.coerce.boolean().default(false),
  cableType: z.string().max(60).optional().or(z.literal('')),
  warranty: z.string().max(60).optional().or(z.literal(''))
});

export const createProductSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('BATTERIE'), ...baseProduct, spec: batterySpecSchema }),
  z.object({ kind: z.literal('CHARGEUR'), ...baseProduct, spec: chargerSpecSchema })
]);

/** Meme forme que createProductSchema, avec l'id de la fiche a modifier. */
export const updateProductSchema = z.object({ id: z.string().min(1) }).and(createProductSchema);

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'RETURN']),
  quantity: z.coerce.number().int().min(1).max(100_000),
  reason: z.string().max(200).optional().or(z.literal(''))
});

export const brandSchema = z.object({
  name: z.string().min(2, 'Nom requis').max(60)
});

export const laptopSchema = z.object({
  brandId: z.string().min(1, 'Marque requise'),
  model: z.string().min(2, 'Modele requis').max(80),
  series: z.string().max(80).optional().or(z.literal(''))
});

/**
 * Les query params sont une entree publique non fiable (types multiples,
 * valeurs dupliquees, chaines arbitraires). On normalise AVANT validation :
 * un tableau ?q=a&q=b devient sa premiere valeur, tout le reste est coerce.
 */
const singleValue = z.preprocess((value) => (Array.isArray(value) ? value[0] : value), z.unknown());

export const searchSchema = z.object({
  q: singleValue.pipe(z.string().max(120).optional()),
  brand: singleValue.pipe(z.string().max(60).optional()),
  category: singleValue.pipe(z.enum(['BATTERIE', 'CHARGEUR']).optional()),
  status: singleValue.pipe(z.enum(['DISPONIBLE', 'SUR_COMMANDE', 'INDISPONIBLE']).optional()),
  minPrice: singleValue.pipe(z.coerce.number().int().min(0).optional()),
  maxPrice: singleValue.pipe(z.coerce.number().int().min(0).optional()),
  watts: singleValue.pipe(z.coerce.number().int().min(0).optional()),
  page: singleValue.pipe(z.coerce.number().int().min(1).max(500).catch(1))
});

export type SearchInput = z.infer<typeof searchSchema>;

/**
 * A utiliser partout ou les parametres viennent de l'URL (searchParams).
 * Ne leve jamais : une entree invalide retombe silencieusement sur des
 * valeurs par defaut plutot que de faire planter la page en 500.
 */
export function parseSearchParams(
  raw: Record<string, string | string[] | undefined>,
  overrides?: Partial<SearchInput>
): SearchInput {
  const result = searchSchema.safeParse({ ...raw, ...overrides });
  if (result.success) return result.data;
  return { page: 1, ...overrides } as SearchInput;
}
export type CreateProductInput = z.infer<typeof createProductSchema>;
