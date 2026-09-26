import { getAllOrders } from '@/services/order.service';
import { OrderStatusSelect } from '@/components/admin/order-status-select';
import { formatDate, formatXof } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Commandes</h1>
      <p className="mt-1 text-sm text-slate-600">
        Passer une commande en "Confirmee" decremente automatiquement le stock.
      </p>

      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Aucune commande.
          </p>
        )}

        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{order.reference}</p>
                <p className="text-sm text-slate-600">
                  {order.firstName} {order.lastName} · {order.phone}
                </p>
                <p className="text-xs text-slate-500">
                  {order.city}, {order.district} · {formatDate(order.createdAt)}
                </p>
              </div>
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>

            <ul className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.productName} ({item.productRef}) x{item.quantity}
                  </span>
                  <span>{formatXof(item.totalPriceXof)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm">
              <span className="text-slate-500">
                Livraison : {formatXof(order.deliveryXof)} · {order.paymentMethod === 'WHATSAPP' ? 'WhatsApp' : 'A la livraison'}
              </span>
              <span className="font-semibold text-slate-900">{formatXof(order.totalXof)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
