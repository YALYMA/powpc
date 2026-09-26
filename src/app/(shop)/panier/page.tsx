import type { Metadata } from 'next';
import { CartView } from '@/components/shop/cart-view';

export const metadata: Metadata = { title: 'Mon panier', robots: { index: false } };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">Mon panier</h1>
      <CartView />
    </div>
  );
}
