import type { Metadata } from 'next';
import { CONTACT, SITE } from '@/lib/constants';

export const metadata: Metadata = { title: 'Politique de confidentialite' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Politique de confidentialite
      </h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-base font-semibold text-slate-900">Donnees collectees</h2>
          <p className="mt-2">
            Lors d'une commande, d'une demande de disponibilite ou de la creation d'un compte,
            {' '}{SITE.name} collecte : nom, telephone, WhatsApp, adresse de livraison, et
            historique des commandes. Aucune donnee bancaire n'est stockee : les paiements se
            font a la livraison ou par accord direct via WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Utilisation</h2>
          <p className="mt-2">
            Ces informations servent exclusivement au traitement des commandes, a la livraison,
            et a la reponse aux demandes de disponibilite. Elles ne sont ni vendues ni partagees
            avec des tiers a des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Conservation</h2>
          <p className="mt-2">
            Les donnees de compte sont conservees tant que le compte est actif. Les demandes de
            disponibilite et commandes sont conservees a des fins de suivi et de garantie.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Vos droits</h2>
          <p className="mt-2">
            Vous pouvez demander l'acces, la correction ou la suppression de vos donnees en nous
            ecrivant a {CONTACT.email}.
          </p>
        </section>
      </div>
    </div>
  );
}
