import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { WhatsappButton } from '@/components/shop/whatsapp-button';
import { getOrderByReference } from '@/services/order.service';
import { formatDate, formatXof } from '@/lib/utils';
import { ORDER_STATUS_CLASS, ORDER_STATUS_LABEL } from '@/lib/constants';

export const metadata: Metadata = { title: 'Detail de commande', robots: { index: false } };

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = await getOrderByReference(reference.toUpperCase());
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Commande {order.reference}</h1>
          <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={ORDER_STATUS_CLASS[order.status]}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-sm font-semibold text-slate-900">Articles</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.productName} <span className="text-slate-500">x{item.quantity}</span>
              </span>
              <span className="font-medium text-slate-900">{formatXof(item.totalPriceXof)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Sous-total</dt>
            <dd>{formatXof(order.subtotalXof)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Livraison</dt>
            <dd>{order.deliveryXof === 0 ? 'Gratuit' : formatXof(order.deliveryXof)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-semibold text-slate-900">
            <dt>Total</dt>
            <dd>{formatXof(order.totalXof)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-sm text-slate-600">
        <p>
          Livraison a {order.city}, {order.district}
          {order.addressDetails ? ` (${order.addressDetails})` : ''}.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <WhatsappButton
          label="Une question sur cette commande ?"
          message={`Bonjour, j'ai une question au sujet de ma commande ${order.reference}.`}
        />
      </div>
    </div>
  );
}
