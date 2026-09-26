import 'server-only';
import { prisma } from '@/lib/prisma';
import { getLowStockProducts } from './stock.service';

export async function getDashboardStats() {
  const [productCount, orderCount, requestCount, clientCount, revenue, lowStock, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.availabilityRequest.count({ where: { status: 'NOUVELLE' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.aggregate({
        _sum: { totalXof: true },
        where: { status: { in: ['CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'] } }
      }),
      getLowStockProducts(),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { items: true } })
    ]);

  return {
    productCount,
    orderCount,
    requestCount,
    clientCount,
    revenueXof: revenue._sum.totalXof ?? 0,
    lowStock,
    recentOrders
  };
}
