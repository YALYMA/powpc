import type { Metadata } from 'next';
import { FavoritesList } from '@/components/shop/favorites-list';

export const metadata: Metadata = { title: 'Mes favoris', robots: { index: false } };

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mes favoris</h1>
      <p className="mt-1 text-sm text-slate-600">
        Vos produits enregistres, conserves sur cet appareil.
      </p>
      <div className="mt-8">
        <FavoritesList />
      </div>
    </div>
  );
}
