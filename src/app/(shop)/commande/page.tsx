import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/shop/checkout-form';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'Finaliser ma commande', robots: { index: false } };

export default async function CheckoutPage() {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { firstName: true, lastName: true, phone: true, whatsapp: true }
      })
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">Finaliser ma commande</h1>
      <CheckoutForm
        defaults={{
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          phone: user?.phone ?? '',
          whatsapp: user?.whatsapp ?? ''
        }}
      />
    </div>
  );
}
