'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[PowerPC] Erreur page admin :', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-lg font-semibold text-slate-900">Erreur dans le back-office</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        L'operation a echoue. Reessayez ; si le probleme persiste, verifiez la console serveur.
      </p>
      <Button className="mt-5" onClick={() => reset()}>
        Reessayer
      </Button>
    </div>
  );
}
