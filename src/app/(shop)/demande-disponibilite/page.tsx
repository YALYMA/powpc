import type { Metadata } from 'next';
import { AvailabilityForm } from '@/components/shop/availability-form';

export const metadata: Metadata = {
  title: 'Demande de disponibilite',
  description:
    "Le produit que vous cherchez n'est pas au catalogue ? Envoyez-nous le modele de votre PC, nous le recherchons pour vous."
};

export default function AvailabilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Demande de disponibilite
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Decrivez votre ordinateur et le produit recherche. Nous vous repondons sur WhatsApp des
          que possible.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <AvailabilityForm />
      </div>
    </div>
  );
}
