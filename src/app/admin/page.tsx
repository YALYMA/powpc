import Link from 'next/link';
import { AlertTriangle, Package, ShoppingCart, Users, Wallet, Inbox } from 'lucide-react';
import { getDashboardStats } from '@/services/dashboard.service';
import { formatDate, formatXof } from '@/lib/utils';
import { ORDER_STATUS_CLASS, ORDER_STATUS_LABEL } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Chiffre d'affaires", value: formatXof(stats.revenueXof), icon: Wallet },
    { label: 'Commandes', value: stats.orderCount, icon: ShoppingCart },
    { label: 'Produits actifs', value: stats.productCount, icon: Package },
    { label: 'Demandes nouvelles', value: stats.requestCount, icon: Inbox },
    { label: 'Clients', value: stats.clientCount, icon: Users },
    { label: 'Stock faible', value: stats.lowStock.length, icon: AlertTriangle }
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{card.label}</p>
              <card.icon className="h-4 w-4 text-slate-400" aria-hidden />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Dernieres commandes</h2>
            <Link href="/admin/commandes" className="text-xs font-medium text-brand-600 hover:underline">
              Tout voir
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {stats.recentOrders.length === 0 && (
              <li className="px-5 py-6 text-sm text-slate-500">Aucune commande pour le moment.</li>
            )}
            {stats.recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {order.reference} — {order.firstName} {order.lastName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(order.createdAt)} · {order.items.length} article(s)
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold">{formatXof(order.totalXof)}</span>
                  <Badge className={ORDER_STATUS_CLASS[order.status]}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Stock faible</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {stats.lowStock.length === 0 && (
              <li className="px-5 py-6 text-sm text-slate-500">Tous les stocks sont corrects.</li>
            )}
            {stats.lowStock.map((product) => (
              <li key={product.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.reference}</p>
                </div>
                <span className="text-sm font-semibold text-amber-600">{product.stock}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
