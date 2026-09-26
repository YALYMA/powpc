import 'server-only';
import type { CategoryType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { productCardSelect } from './product.service';

export async function getBrandsWithLaptops() {
  return prisma.brand.findMany({
    where: { laptops: { some: {} } },
    select: {
      id: true,
      name: true,
      slug: true,
      laptops: {
        select: { id: true, model: true, series: true, slug: true },
        orderBy: { model: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });
}

export async function getLaptop(laptopId: string) {
  return prisma.laptop.findUnique({
    where: { id: laptopId },
    include: { brand: true }
  });
}

/** Coeur du finder : produits compatibles avec un modele de PC donne. */
export async function findCompatibleProducts(laptopId: string, type?: CategoryType) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      compatibilities: { some: { laptopId } },
      ...(type ? { category: { type } } : {})
    },
    select: productCardSelect,
    orderBy: [{ status: 'asc' }, { priceXof: 'asc' }]
  });
}

export async function getAllLaptops() {
  return prisma.laptop.findMany({
    include: { brand: true, _count: { select: { compatibilities: true } } },
    orderBy: [{ brand: { name: 'asc' } }, { model: 'asc' }]
  });
}
