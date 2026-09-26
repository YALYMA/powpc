import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Truck, ShieldCheck, Package } from 'lucide-react';
import { StatusBadge } from '@/components/ui/badge';
import { AddToCart } from '@/components/shop/add-to-cart';
import { WhatsappButton } from '@/components/shop/whatsapp-button';
import { ProductCard } from '@/components/shop/product-card';
import { ProductGallery } from '@/components/shop/product-gallery';
import { ShareButtons } from '@/components/shop/share-buttons';
import { StarRatingDisplay } from '@/components/shop/star-rating';
import { ReviewsSection } from '@/components/shop/reviews-section';
import { getProductBySlug, getRelatedProducts } from '@/services/product.service';
import { getReviews, getReviewSummary } from '@/services/review.service';
import { productWhatsappMessage } from '@/lib/whatsapp';
import { formatXof, safeJsonLd } from '@/lib/utils';
import { SITE } from '@/lib/constants';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Produit introuvable' };

  const compat = product.compatibilities
    .slice(0, 5)
    .map((c) => `${c.laptop.brand.name} ${c.laptop.model}`)
    .join(', ');

  return {
    title: `${product.name} - ${product.reference}`,
    description: `${product.name} (ref. ${product.reference}) a ${formatXof(product.priceXof)}. Compatible : ${compat}. Livraison au Senegal.`,
    alternates: { canonical: `${SITE.url}/produits/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description ?? SITE.description,
      images: product.images[0]?.url ? [product.images[0].url] : undefined
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const laptopIds = product.compatibilities.map((c) => c.laptopId);
  const [related, reviewSummary, reviews] = await Promise.all([
    getRelatedProducts(product.id, laptopIds),
    getReviewSummary(product.id),
    getReviews(product.id)
  ]);
  const firstCompat = product.compatibilities[0];
  const compatLabel = firstCompat
    ? `${firstCompat.laptop.brand.name} ${firstCompat.laptop.model}`
    : null;

  const specs: Array<[string, string]> = product.batterySpec
    ? ([
        ['Tension', `${product.batterySpec.voltage} V`],
        product.batterySpec.capacityMah ? ['Capacite', `${product.batterySpec.capacityMah} mAh`] : null,
        product.batterySpec.capacityWh ? ['Energie', `${product.batterySpec.capacityWh} Wh`] : null,
        product.batterySpec.cells ? ['Cellules', String(product.batterySpec.cells)] : null,
        ['Chimie', product.batterySpec.chemistry ?? 'Li-ion'],
        ['Montage', product.batterySpec.isInternal ? 'Interne' : 'Externe'],
        product.batterySpec.warranty ? ['Garantie', product.batterySpec.warranty] : null
      ].filter(Boolean) as Array<[string, string]>)
    : product.chargerSpec
      ? ([
          ['Puissance', `${product.chargerSpec.watts} W`],
          ['Tension', `${product.chargerSpec.voltage} V`],
          ['Amperage', `${product.chargerSpec.amperage} A`],
          ['Connecteur', product.chargerSpec.connector],
          ['USB-C', product.chargerSpec.isUsbC ? 'Oui' : 'Non'],
          product.chargerSpec.cableType ? ['Cable', product.chargerSpec.cableType] : null,
          product.chargerSpec.warranty ? ['Garantie', product.chargerSpec.warranty] : null
        ].filter(Boolean) as Array<[string, string]>)
      : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.reference,
    brand: { '@type': 'Brand', name: product.brand.name },
    description: product.description ?? undefined,
    ...(reviewSummary.count > 0 && reviewSummary.average !== null
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviewSummary.average,
            reviewCount: reviewSummary.count
          }
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: product.priceXof,
      priceCurrency: 'XOF',
      availability:
        product.status === 'DISPONIBLE'
          ? 'https://schema.org/InStock'
          : product.status === 'SUR_COMMANDE'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/OutOfStock',
      url: `${SITE.url}/produits/${product.slug}`
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Accueil</Link>
        <span className="mx-2">/</span>
        <Link
          href={product.category.type === 'BATTERIE' ? '/batteries' : '/chargeurs'}
          className="hover:text-brand-600"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{product.reference}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
              {product.brand.name}
            </span>
            <StatusBadge status={product.status} />
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Reference : {product.reference}</p>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            {reviewSummary.count > 0 && reviewSummary.average !== null ? (
              <div className="flex items-center gap-1.5">
                <StarRatingDisplay average={reviewSummary.average} />
                <span className="text-xs text-slate-500">
                  {reviewSummary.average.toFixed(1)} ({reviewSummary.count} avis)
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Aucun avis pour le moment</span>
            )}
            <ShareButtons title={product.name} url={`${SITE.url}/produits/${product.slug}`} />
          </div>

          <p className="mt-5 text-3xl font-bold text-slate-900">{formatXof(product.priceXof)}</p>
          {product.status !== 'INDISPONIBLE' && (
            <p className="mt-1 text-sm text-slate-600">
              {product.stock > 0 ? `${product.stock} en stock` : 'Disponible sur commande'}
            </p>
          )}

          <div className="mt-6 space-y-3">
            <AddToCart
              line={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                reference: product.reference,
                priceXof: product.priceXof,
                imageUrl: product.images[0]?.url ?? null
              }}
              disabled={product.status === 'INDISPONIBLE'}
            />
            <WhatsappButton
              className="w-full sm:w-auto"
              message={productWhatsappMessage({
                name: product.name,
                reference: product.reference,
                compatibleWith: compatLabel
              })}
            />
          </div>

          {specs.length > 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white">
              <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900">
                Caracteristiques techniques
              </h2>
              <dl className="divide-y divide-slate-100">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between px-5 py-3 text-sm">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-medium text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.compatibilities.length > 0 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-900">Modeles compatibles</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.compatibilities.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {c.laptop.brand.name} {c.laptop.model}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.description && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-900">Description</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, text: 'Livraison Dakar 24h' },
              { icon: ShieldCheck, text: 'Compatibilite verifiee' },
              { icon: Package, text: 'Paiement a la livraison' }
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"
              >
                <item.icon className="h-4 w-4 text-brand-600" aria-hidden />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewsSection
        productId={product.id}
        average={reviewSummary.average}
        count={reviewSummary.count}
        reviews={reviews}
      />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">Produits compatibles similaires</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
