import type { Metadata } from 'next';
import { RegisterForm } from '@/components/shop/auth-forms';

export const metadata: Metadata = { title: 'Creer un compte', robots: { index: false } };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Creer un compte</h1>
      <p className="mt-1 text-sm text-slate-600">
        Suivez vos commandes et vos demandes de disponibilite.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <RegisterForm />
      </div>
    </div>
  );
}
