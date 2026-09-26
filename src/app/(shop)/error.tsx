'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShopError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Point d'accroche pour brancher un outil de suivi d'erreurs (Sentry, etc.).
    console.error('[PowerPC] Erreur page boutique :', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500" aria-hidden />
      <h1 className="mt-6 text-xl font-semibold text-slate-900">Une erreur est survenue</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Ce n'est pas de votre faute. Vous pouvez reessayer, ou revenir a l'accueil et nous
        contacter si le probleme persiste.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Reessayer</Button>
        <Link href="/"><Button variant="outline">Retour a l'accueil</Button></Link>
      </div>
    </div>
  );
}
