import type { Metadata } from 'next';
import { OrderLookupForm } from '@/components/shop/order-lookup-form';

export const metadata: Metadata = { title: 'Suivre ma commande', robots: { index: false } };

export default function OrderLookupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suivre ma commande</h1>
      <p className="mt-2 text-sm text-slate-600">
        Entrez la reference recue lors de la confirmation (format PPC-XXXXXX-XXXXXX).
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <OrderLookupForm />
      </div>
    </div>
  );
}
