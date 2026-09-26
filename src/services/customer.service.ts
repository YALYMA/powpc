import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getClients(query?: string) {
  return prisma.user.findMany({
    where: {
      role: 'USER',
      ...(query
        ? {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      whatsapp: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true, requests: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}

export async function toggleClientActive(id: string, isActive: boolean) {
  return prisma.user.update({ where: { id }, data: { isActive } });
}
