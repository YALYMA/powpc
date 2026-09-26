import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productCardSelect } from '@/services/product.service';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * Les favoris sont stockes cote client (localStorage, comme le panier) :
 * cette route se contente de resoudre une liste d'ids en fiches produit
 * a jour (prix, stock, disponibilite peuvent avoir change depuis l'ajout).
 */
export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`favorites-api:${ip}`, { max: 60, windowMs: 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json({ products: [] }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get('ids') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 100);

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    select: productCardSelect
  });

  return NextResponse.json({ products }, { headers: { 'Cache-Control': 'private, max-age=10' } });
}
