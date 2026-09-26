import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = { title: 'Conditions generales de vente' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Conditions generales de vente
      </h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-base font-semibold text-slate-900">1. Objet</h2>
          <p className="mt-2">
            Les presentes conditions regissent la vente de batteries, chargeurs et accessoires
            pour ordinateurs portables proposes par {SITE.name}.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">2. Compatibilite</h2>
          <p className="mt-2">
            Les compatibilites indiquees sur chaque fiche produit sont verifiees au meilleur de
            nos connaissances. En cas de doute sur un modele precis, le client est invite a
            contacter le service client avant de commander.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">3. Prix et paiement</h2>
          <p className="mt-2">
            Les prix sont indiques en francs CFA (FCFA), toutes taxes comprises. Le paiement
            s'effectue a la livraison ou par accord prealable via WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">4. Livraison</h2>
          <p className="mt-2">
            Livraison a Dakar sous 24 a 48h ouvrees, dans les autres regions sous 72h. Les
            delais sont indicatifs et peuvent varier selon la disponibilite du produit.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">5. Garantie et retours</h2>
          <p className="mt-2">
            Chaque produit beneficie de la garantie indiquee sur sa fiche (generalement 6 mois).
            Un produit defectueux a la reception peut etre echange dans les 48h suivant la
            livraison, sur presentation de la preuve d'achat.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">6. Annulation</h2>
          <p className="mt-2">
            Une commande peut etre annulee tant qu'elle n'a pas ete confirmee par nos equipes.
            Contactez-nous par WhatsApp en indiquant votre reference de commande.
          </p>
        </section>
      </div>
    </div>
  );
}
