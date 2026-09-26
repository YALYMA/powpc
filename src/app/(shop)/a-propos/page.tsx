import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'A propos',
  description:
    'PowerPC est specialise dans les batteries et chargeurs pour ordinateurs portables au Senegal. Compatibilite verifiee, assistance et livraison.'
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Qui sommes-nous ?
      </h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-600">
        <p>
          PowerPC est une boutique specialisee dans les batteries et les chargeurs d'ordinateurs
          portables au Senegal. Nous avons fait un choix simple : faire peu de categories, mais les
          faire bien.
        </p>

        <div>
          <h2 className="text-base font-semibold text-slate-900">Notre objectif</h2>
          <p className="mt-2">
            La plupart des clients ne connaissent pas la reference exacte de leur batterie. Notre
            catalogue est donc construit a l'envers : on part du modele de votre ordinateur, et on
            remonte vers les produits qui lui correspondent reellement.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">Notre specialisation</h2>
          <p className="mt-2">
            Batteries internes et externes, chargeurs 45W a 90W, connecteurs classiques et USB-C.
            Chaque compatibilite est enregistree modele par modele, et non devinee.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">Assistance</h2>
          <p className="mt-2">
            Un doute sur votre modele ? Envoyez-nous une photo de l'etiquette de votre batterie ou
            le numero de serie de votre PC sur WhatsApp. Nous verifions avant que vous commandiez.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">Livraison</h2>
          <p className="mt-2">
            Livraison a Dakar sous 24h, dans les autres regions sous 72h. Paiement a la livraison
            disponible. Les paiements mobiles seront ajoutes prochainement.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/compatibilite">
          <Button>Verifier ma compatibilite</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Nous contacter</Button>
        </Link>
      </div>
    </div>
  );
}
