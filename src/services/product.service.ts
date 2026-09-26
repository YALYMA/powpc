import 'server-only';
import { Prisma, type CategoryType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { SearchInput } from '@/schemas/product.schema';

export const PAGE_SIZE = 12;

export const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  reference: true,
  priceXof: true,
  comparePriceXof: true,
  stock: true,
  status: true,
  brand: { select: { name: true, slug: true } },
  category: { select: { name: true, slug: true, type: true } },
  images: { select: { url: true, alt: true }, orderBy: { position: 'asc' }, take: 1 },
  batterySpec: { select: { voltage: true, capacityWh: true, capacityMah: true, cells: true } },
  chargerSpec: { select: { watts: true, voltage: true, amperage: true, connector: true, isUsbC: true } },
  compatibilities: {
    select: { laptop: { select: { model: true, brand: { select: { name: true } } } } },
    take: 3
  }
} satisfies Prisma.ProductSelect;

export type ProductCard = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

function buildWhere(params: SearchInput): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };
  const and: Prisma.ProductWhereInput[] = [];

  if (params.category) and.push({ category: { type: params.category as CategoryType } });
  if (params.brand) and.push({ brand: { slug: params.brand } });
  if (params.status) and.push({ status: params.status });
  if (params.watts) and.push({ chargerSpec: { watts: params.watts } });
  if (params.minPrice !== undefined) and.push({ priceXof: { gte: params.minPrice } });
  if (params.maxPrice !== undefined) and.push({ priceXof: { lte: params.maxPrice } });

  const q = params.q?.trim();
  if (q) {
    // Recherche tolerante : chaque terme doit matcher au moins un champ.
    const terms = q.split(/\s+/).filter(Boolean).slice(0, 5);
    for (const term of terms) {
      and.push({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { reference: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { brand: { name: { contains: term, mode: 'insensitive' } } },
          { compatibilities: { some: { laptop: { model: { contains: term, mode: 'insensitive' } } } } },
          { compatibilities: { some: { laptop: { series: { contains: term, mode: 'insensitive' } } } } }
        ]
      });
    }
  }

  if (and.length) where.AND = and;
  return where;
}

export async function searchProducts(params: SearchInput) {
  const where = buildWhere(params);
  const page = params.page ?? 1;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productCardSelect,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    prisma.product.count({ where })
  ]);

  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      brand: true,
      category: true,
      batterySpec: true,
      chargerSpec: true,
      images: { orderBy: { position: 'asc' } },
      compatibilities: {
        include: { laptop: { include: { brand: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function getRelatedProducts(productId: string, laptopIds: string[], limit = 4) {
  if (!laptopIds.length) return [];
  return prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      compatibilities: { some: { laptopId: { in: laptopIds } } }
    },
    select: productCardSelect,
    take: limit
  });
}

export async function getFeaturedProducts(type: CategoryType, limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true, status: 'DISPONIBLE', category: { type } },
    select: productCardSelect,
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

export async function getBrandsForFilter() {
  return prisma.brand.findMany({
    where: { products: { some: { isActive: true } } },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  });
}

export async function getWattOptions() {
  const rows = await prisma.chargerSpec.findMany({
    distinct: ['watts'],
    select: { watts: true },
    orderBy: { watts: 'asc' }
  });
  return rows.map((r) => r.watts);
}

/** Suggestions rapides pour l'autocompletion de la barre de recherche. */
export async function suggest(query: string) {
  const q = query.trim();
  if (q.length < 2) return { products: [], laptops: [] };

  const [products, laptops] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { reference: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: { name: true, slug: true, reference: true, priceXof: true },
      take: 5
    }),
    prisma.laptop.findMany({
      where: {
        OR: [
          { model: { contains: q, mode: 'insensitive' } },
          { series: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: { id: true, model: true, slug: true, brand: { select: { name: true } } },
      take: 5
    })
  ]);

  return { products, laptops };
}
