import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/shop/auth-forms';

export const metadata: Metadata = { title: 'Mot de passe oublie', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mot de passe oublie</h1>
      <p className="mt-1 text-sm text-slate-600">
        Indiquez votre email, nous vous envoyons un lien pour choisir un nouveau mot de passe.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
