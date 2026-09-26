import 'server-only';
import { prisma } from '@/lib/prisma';
import type { ReviewInput } from '@/schemas/review.schema';

/**
 * Moyenne calculée à partir des avis réellement enregistrés. Si count est 0,
 * average vaut null.
 */
export async function getReviewSummary(productId: string): Promise<{ average: number | null; count: number }> {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: {
      _all: true,
    },
  });

  return {
    average: result._avg.rating,
    count: result._count._all,
  };
}

export async function getReviews(productId: string, limit = 20) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function createReview(input: ReviewInput) {
  const product = await prisma.product.findUnique({ where: { id: input.productId }, select: { id: true } });
  if (!product) throw new Error('Produit introuvable.');

  return prisma.review.create({
    data: {
      productId: input.productId,
      customerName: input.customerName,
      rating: input.rating,
      comment: input.comment || null,
    },
  });
}