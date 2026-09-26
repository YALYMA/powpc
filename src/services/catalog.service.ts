import 'server-only';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import type { CreateProductInput } from '@/schemas/product.schema';

export async function getAdminProducts(query?: string) {
  return prisma.product.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { reference: { contains: query, mode: 'insensitive' } }
          ]
        }
      : undefined,
    include: {
      brand: true,
      category: true,
      images: { take: 1, orderBy: { position: 'asc' } },
      _count: { select: { compatibilities: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}

export async function getBrands() {
  return prisma.brand.findMany({
    include: { _count: { select: { products: true, laptops: true } } },
    orderBy: { name: 'asc' }
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function createBrand(name: string) {
  return prisma.brand.create({ data: { name, slug: slugify(name) } });
}

export async function createLaptop(input: { brandId: string; model: string; series?: string }) {
  const brand = await prisma.brand.findUniqueOrThrow({ where: { id: input.brandId } });
  return prisma.laptop.create({
    data: {
      brandId: input.brandId,
      model: input.model,
      series: input.series || null,
      slug: slugify(`${brand.name} ${input.model}`)
    }
  });
}

export async function createProduct(input: CreateProductInput) {
  const slug = slugify(`${input.name}-${input.reference}`);

  return prisma.product.create({
    data: {
      name: input.name,
      slug,
      reference: input.reference.toUpperCase(),
      description: input.description || null,
      brandId: input.brandId,
      categoryId: input.categoryId,
      priceXof: input.priceXof,
      comparePriceXof: input.comparePriceXof ?? null,
      stock: input.stock,
      lowStockThreshold: input.lowStockThreshold,
      status: input.status,
      isActive: input.isActive,
      images: {
        create: input.imageUrls.map((url, index) => ({ url, position: index, alt: input.name }))
      },
      compatibilities: {
        create: input.laptopIds.map((laptopId) => ({ laptopId, verified: true }))
      },
      ...(input.kind === 'BATTERIE'
        ? {
            batterySpec: {
              create: {
                voltage: input.spec.voltage,
                capacityMah: input.spec.capacityMah ?? null,
                capacityWh: input.spec.capacityWh ?? null,
                cells: input.spec.cells ?? null,
                chemistry: input.spec.chemistry || 'Li-ion',
                isInternal: input.spec.isInternal,
                warranty: input.spec.warranty || null
              }
            }
          }
        : {
            chargerSpec: {
              create: {
                watts: input.spec.watts,
                voltage: input.spec.voltage,
                amperage: input.spec.amperage,
                connector: input.spec.connector,
                isUsbC: input.spec.isUsbC,
                cableType: input.spec.cableType || null,
                warranty: input.spec.warranty || null
              }
            }
          })
    }
  });
}

export async function getProductForEdit(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      batterySpec: true,
      chargerSpec: true,
      images: { orderBy: { position: 'asc' } },
      compatibilities: { select: { laptopId: true } }
    }
  });
}

export async function updateProduct(id: string, input: CreateProductInput) {
  const existing = await prisma.product.findUniqueOrThrow({ where: { id } });

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        name: input.name,
        reference: input.reference.toUpperCase(),
        description: input.description || null,
        brandId: input.brandId,
        categoryId: input.categoryId,
        priceXof: input.priceXof,
        comparePriceXof: input.comparePriceXof ?? null,
        // Le stock n'est PAS modifiable ici : il ne bouge que via
        // applyStockMovement, pour garder un historique StockMovement fiable.
        // Seul le statut (bascule manuelle DISPONIBLE/INDISPONIBLE) l'est.
        status: input.status,
        isActive: input.isActive,
        lowStockThreshold: input.lowStockThreshold
      }
    });

    await tx.productImage.deleteMany({ where: { productId: id } });
    if (input.imageUrls.length) {
      await tx.productImage.createMany({
        data: input.imageUrls.map((url, index) => ({
          productId: id,
          url,
          position: index,
          alt: input.name
        }))
      });
    }

    await tx.compatibility.deleteMany({ where: { productId: id } });
    if (input.laptopIds.length) {
      await tx.compatibility.createMany({
        data: input.laptopIds.map((laptopId) => ({ productId: id, laptopId, verified: true }))
      });
    }

    if (input.kind === 'BATTERIE') {
      await tx.chargerSpec.deleteMany({ where: { productId: id } });
      await tx.batterySpec.upsert({
        where: { productId: id },
        create: {
          productId: id,
          voltage: input.spec.voltage,
          capacityMah: input.spec.capacityMah ?? null,
          capacityWh: input.spec.capacityWh ?? null,
          cells: input.spec.cells ?? null,
          chemistry: input.spec.chemistry || 'Li-ion',
          isInternal: input.spec.isInternal,
          warranty: input.spec.warranty || null
        },
        update: {
          voltage: input.spec.voltage,
          capacityMah: input.spec.capacityMah ?? null,
          capacityWh: input.spec.capacityWh ?? null,
          cells: input.spec.cells ?? null,
          chemistry: input.spec.chemistry || 'Li-ion',
          isInternal: input.spec.isInternal,
          warranty: input.spec.warranty || null
        }
      });
    } else {
      await tx.batterySpec.deleteMany({ where: { productId: id } });
      await tx.chargerSpec.upsert({
        where: { productId: id },
        create: {
          productId: id,
          watts: input.spec.watts,
          voltage: input.spec.voltage,
          amperage: input.spec.amperage,
          connector: input.spec.connector,
          isUsbC: input.spec.isUsbC,
          cableType: input.spec.cableType || null,
          warranty: input.spec.warranty || null
        },
        update: {
          watts: input.spec.watts,
          voltage: input.spec.voltage,
          amperage: input.spec.amperage,
          connector: input.spec.connector,
          isUsbC: input.spec.isUsbC,
          cableType: input.spec.cableType || null,
          warranty: input.spec.warranty || null
        }
      });
    }
  });

  return existing;
}

export async function toggleProductActive(id: string, isActive: boolean) {
  return prisma.product.update({ where: { id }, data: { isActive } });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function setCompatibilities(productId: string, laptopIds: string[]) {
  return prisma.$transaction(async (tx) => {
    await tx.compatibility.deleteMany({ where: { productId } });
    if (laptopIds.length) {
      await tx.compatibility.createMany({
        data: laptopIds.map((laptopId) => ({ productId, laptopId, verified: true }))
      });
    }
  });
}
