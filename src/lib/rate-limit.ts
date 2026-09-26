import 'server-only';

/**
 * Limiteur de debit en memoire, par cle (IP + action).
 *
 * Limite connue : cet etat vit dans le processus Node. Sur un deploiement
 * multi-instance (plusieurs conteneurs, ou serverless avec plusieurs
 * fonctions actives), chaque instance a son propre compteur, ce qui divise
 * l'efficacite reelle par le nombre d'instances. Pour une protection stricte
 * en production multi-instance, remplacer ce module par un compteur partage
 * (Redis / Upstash) en conservant la meme fonction `checkRateLimit`.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Purge periodique pour ne pas laisser grossir la Map indefiniment.
setInterval(
  () => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  },
  5 * 60 * 1000
).unref?.();

export function checkRateLimit(
  key: string,
  options: { max: number; windowMs: number }
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= options.max) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Identifiant client best-effort a partir des en-tetes proxy usuels. */
export async function getClientIp(): Promise<string> {
  const { headers } = await import('next/headers');
  const store = await headers();
  const forwarded = store.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return store.get('x-real-ip') ?? 'unknown';
}
