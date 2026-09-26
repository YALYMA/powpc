import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/shop/auth-forms';

export const metadata: Metadata = { title: 'Connexion', robots: { index: false } };

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Connexion</h1>
      <p className="mt-1 text-sm text-slate-600">Accedez a vos commandes et vos demandes.</p>

      {reset === 'ok' && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Votre mot de passe a ete change. Connectez-vous avec votre nouveau mot de passe.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
