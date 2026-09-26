import Link from 'next/link';
import {
  BatteryCharging,
  Plug,
  ShieldCheck,
  Truck,
  Lock,
  Headphones
} from 'lucide-react';
import { SearchBar } from '@/components/shop/search-bar';
import { ProductCard } from '@/components/shop/product-card';
import { FinderForm } from '@/components/shop/finder-form';
import { CategoryTiles } from '@/components/shop/category-tiles';
import { HeroIllustration } from '@/components/shop/hero-illustration';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts } from '@/services/product.service';
import { getBrandsWithLaptops } from '@/services/compatibility.service';

export const revalidate = 300;

const TRUST_BADGES = [
  { icon: ShieldCheck, title: 'Compatible garanti', text: 'Resultat fiable et precis' },
  { icon: Truck, title: 'Expedition rapide', text: 'Livraison en 24-48h' },
  { icon: Lock, title: 'Paiement securise', text: '100% securise' },
  { icon: Headphones, title: 'Service client reactif', text: 'Une equipe a votre ecoute' }
];

export default async function HomePage() {
  const [batteries, chargers, brands] = await Promise.all([
    getFeaturedProducts('BATTERIE', 4),
    getFeaturedProducts('CHARGEUR', 4),
    getBrandsWithLaptops()
  ]);

  return (
    <>
      {/* HERO */}
      <section className="bg-hero-radiance border-b border-slate-200">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-sm ring-1 ring-brand-100">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Compatibilite verifiee produit par produit
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Trouvez la batterie ou le chargeur compatible avec votre PC
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600">
              Recherchez par modele, reference ou marque et trouvez rapidement le produit adapte a
              votre ordinateur.
            </p>

            <div className="mt-7 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/batteries">
                <Button size="lg">
                  <BatteryCharging className="h-4 w-4" aria-hidden /> Trouver ma batterie
                </Button>
              </Link>
              <Link href="/chargeurs">
                <Button size="lg" variant="outline" className="bg-white">
                  <Plug className="h-4 w-4" aria-hidden /> Trouver mon chargeur
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </div>

        {/* Bandeau de confiance, ancre au bas du hero */}
        <div className="border-t border-slate-200 bg-white/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <badge.icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{badge.title}</p>
                  <p className="truncate text-xs text-slate-500">{badge.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Nos categories</h2>
        </div>
        <CategoryTiles />
      </section>

      {/* FINDER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Trouvez le produit compatible avec votre PC
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Selectionnez la marque et le modele de votre ordinateur, nous affichons ce qui lui va.
          </p>
          <div className="mt-6">
            <FinderForm brands={brands} />
          </div>
        </div>
      </section>

      <ProductSection title="Batteries populaires" href="/batteries" products={batteries} />
      <ProductSection title="Chargeurs populaires" href="/chargeurs" products={chargers} />

      {/* CTA BANNER */}
      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-cta-radiance px-6 py-10 text-center sm:px-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10" />
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Votre PC merite le meilleur</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
            Des pieces de qualite, compatibles et garanties pour une performance durable.
          </p>
          <Link href="/catalogue" className="mt-6 inline-block">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-slate-100">
              Decouvrir le catalogue
            </Button>
          </Link>
        </div>
      </section>

      {/* Rappel de confiance en pied de page */}
      <section className="mx-auto mt-12 max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-8 md:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <badge.icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
                <p className="text-xs text-slate-500">{badge.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ProductSection({
  title,
  href,
  products
}: {
  title: string;
  href: string;
  products: Awaited<ReturnType<typeof getFeaturedProducts>>;
}) {
  if (!products.length) return null;

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <Link href={href} className="text-sm font-medium text-brand-600 hover:underline">
          Tout voir
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
