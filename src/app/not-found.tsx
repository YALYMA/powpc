import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <SearchX className="h-12 w-12 text-slate-400" aria-hidden />
      <h1 className="mt-6 text-2xl font-bold text-slate-900">Page introuvable</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Le lien suivi ne mene a aucune page existante. Le produit a peut-etre ete retire ou
        deplace.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>Retour a l'accueil</Button>
        </Link>
        <Link href="/recherche">
          <Button variant="outline">Rechercher un produit</Button>
        </Link>
      </div>
    </div>
  );
}
