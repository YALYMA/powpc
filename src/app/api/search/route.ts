import { NextResponse } from 'next/server';
import { suggest } from '@/services/product.service';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = checkRateLimit(`search-api:${ip}`, { max: 60, windowMs: 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { products: [], laptops: [] },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').slice(0, 80);

  if (query.trim().length < 2) {
    return NextResponse.json({ products: [], laptops: [] });
  }

  const data = await suggest(query);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'private, max-age=30' }
  });
}
