import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhatsappButton } from '@/components/shop/whatsapp-button';

export const metadata: Metadata = { title: 'Commande enregistree', robots: { index: false } };

export default async function ConfirmationPage({
  searchParams
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" aria-hidden />
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Votre commande est enregistree</h1>
      {ref && (
        <p className="mt-2 text-sm text-slate-600">
          Reference : <span className="font-semibold text-slate-900">{ref}</span>
        </p>
      )}
      <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">
        Nous vous appelons pour confirmer la livraison. Vous pouvez aussi nous ecrire directement
        sur WhatsApp en citant votre reference.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <WhatsappButton
          label="Confirmer sur WhatsApp"
          message={`Bonjour, je viens de passer la commande ${ref ?? ''} sur PowerPC.`}
        />
        {ref && (
          <Link href={`/suivi-commande/${ref}`}>
            <Button variant="outline">Suivre ma commande</Button>
          </Link>
        )}
      </div>
      <Link href="/" className="mt-4 inline-block text-sm text-slate-500 hover:text-brand-600">
        Retour a l'accueil
      </Link>
    </div>
  );
}
