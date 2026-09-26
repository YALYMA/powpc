'use server';

import { revalidatePath } from 'next/cache';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { reviewSchema } from '@/schemas/review.schema';
import { createReview } from '@/services/review.service';
import { prisma } from '@/lib/prisma';

export async function createReviewAction(raw: unknown) {
  const ip = await getClientIp();
  const limit = checkRateLimit(`review:${ip}`, { max: 10, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false as const, error: 'Trop d\'avis envoyes. Reessayez plus tard.' };
  }

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: 'Formulaire invalide',
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  try {
    await createReview(parsed.data);
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Impossible d\'enregistrer votre avis.'
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { slug: true }
  });
  if (product) revalidatePath(`/produits/${product.slug}`);

  return { ok: true as const };
}
