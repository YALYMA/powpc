import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/shop/auth-forms';

export const metadata: Metadata = { title: 'Nouveau mot de passe', robots: { index: false } };

export default async function ResetPasswordPage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nouveau mot de passe</h1>
      <p className="mt-1 text-sm text-slate-600">Choisissez un nouveau mot de passe pour votre compte.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
