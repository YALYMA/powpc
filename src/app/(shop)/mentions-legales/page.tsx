import type { Metadata } from 'next';
import { CONTACT, SITE } from '@/lib/constants';

export const metadata: Metadata = { title: 'Mentions legales' };

export default function LegalNoticePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mentions legales</h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-base font-semibold text-slate-900">Editeur du site</h2>
          <p className="mt-2">
            {SITE.name}, entreprise specialisee dans la vente de batteries et chargeurs pour
            ordinateurs portables, basee au Senegal.
            <br />
            Email : {CONTACT.email} — Telephone : {CONTACT.phone}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            A completer avec la forme juridique, le numero NINEA / RCCM et l'adresse du siege
            avant mise en exploitation commerciale.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Hebergement</h2>
          <p className="mt-2">
            A completer avec le nom, l'adresse et le contact de l'hebergeur retenu pour la mise
            en production.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Propriete intellectuelle</h2>
          <p className="mt-2">
            L'ensemble des textes, visuels et elements graphiques presents sur {SITE.name} sont
            proteges. Toute reproduction sans autorisation prealable est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Responsabilite</h2>
          <p className="mt-2">
            {SITE.name} s'efforce d'assurer l'exactitude des informations diffusees (prix,
            disponibilite, compatibilite) mais ne saurait etre tenu responsable d'erreurs ou
            d'omissions. Les compatibilites affichees sont verifiees mais peuvent varier selon
            les revisions materielles d'un meme modele.
          </p>
        </section>
      </div>
    </div>
  );
}
