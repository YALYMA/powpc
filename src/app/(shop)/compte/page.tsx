import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { logoutAction } from '@/actions/auth.actions';
import { LogoutButton } from '@/components/shop/auth-forms';
import { getOrdersByUser } from '@/services/order.service';
import { getRequestsByUser } from '@/services/availability.service';
import { formatDate, formatXof } from '@/lib/utils';
import { ORDER_STATUS_CLASS, ORDER_STATUS_LABEL, REQUEST_STATUS_LABEL } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Mon compte', robots: { index: false } };

export default async function AccountPage() {
  const session = await requireUser();
  const [orders, requests] = await Promise.all([
    getOrdersByUser(session.userId),
    getRequestsByUser(session.userId)
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bonjour {session.firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{session.email}</p>
        </div>
        <div className="flex gap-3">
          {session.role === 'ADMIN' && (
            <Link href="/admin">
              <Button size="sm">Dashboard admin</Button>
            </Link>
          )}
          <LogoutButton action={logoutAction} />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Mes commandes</h2>
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.reference}</p>
                    <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={ORDER_STATUS_CLASS[order.status]}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </Badge>
                </div>

                <ul className="mt-4 space-y-1 text-sm text-slate-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} x{item.quantity} — {formatXof(item.totalPriceXof)}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 border-t border-slate-100 pt-3 text-sm font-semibold text-slate-900">
                  Total : {formatXof(order.totalXof)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Mes demandes de disponibilite</h2>
        {requests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
            Aucune demande envoyee.
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {request.brandName} {request.laptopModel} — {request.type.toLowerCase()}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(request.createdAt)}</p>
                </div>
                <Badge className="bg-slate-100 text-slate-700 ring-slate-200">
                  {REQUEST_STATUS_LABEL[request.status]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
