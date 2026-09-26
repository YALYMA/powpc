import 'server-only';
import { Prisma, type OrderStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { deliveryFee } from '@/lib/constants';
import { orderReference } from '@/lib/utils';
import { applyStockMovement } from './stock.service';
import type { OrderInput } from '@/schemas/order.schema';

/**
 * Cree une commande. Les prix ne viennent JAMAIS du client :
 * ils sont relus en base au moment de la creation. Le stock et le statut
 * sont verifies a cet instant, mais ne sont decrementes qu'a la confirmation
 * (voir updateOrderStatus) : une commande EN_ATTENTE ne bloque pas le stock.
 */
export async function createOrder(input: OrderInput, userId?: string | null) {
  // Deux lignes de panier pour le meme produit (double clic, onglets multiples)
  // sont fusionnees plutot que de faire echouer la commande.
  const merged = new Map<string, number>();
  for (const item of input.items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }
  const ids = [...merged.keys()];

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, reference: true, priceXof: true, isActive: true, status: true, stock: true }
  });

  const missing = ids.filter((id) => !products.some((p) => p.id === id));
  if (missing.length > 0) {
    throw new Error("Un produit du panier n'existe plus. Actualisez votre panier.");
  }

  const unavailable = products.find((p) => !p.isActive || p.status === 'INDISPONIBLE');
  if (unavailable) {
    throw new Error(`"${unavailable.name}" n'est plus disponible. Retirez-le de votre panier.`);
  }

  const lines = [...merged.entries()].map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId)!;
    return {
      productId: product.id,
      productName: product.name,
      productRef: product.reference,
      unitPriceXof: product.priceXof,
      quantity,
      totalPriceXof: product.priceXof * quantity
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.totalPriceXof, 0);
  const delivery = input.deliveryMethod === 'RETRAIT' ? 0 : deliveryFee(input.city);

  // La reference est theoriquement unique mais on retente en cas de collision
  // improbable plutot que de renvoyer une erreur Prisma brute a l'utilisateur.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.order.create({
        data: {
          reference: orderReference(),
          userId: userId ?? null,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          whatsapp: input.whatsapp || null,
          city: input.city,
          district: input.district,
          addressDetails: input.addressDetails || null,
          deliveryMethod: input.deliveryMethod,
          paymentMethod: input.paymentMethod,
          note: input.note || null,
          subtotalXof: subtotal,
          deliveryXof: delivery,
          totalXof: subtotal + delivery,
          items: { create: lines }
        },
        include: { items: true }
      });
    } catch (error) {
      const isUniqueConflict =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
      if (!isUniqueConflict || attempt === 2) throw error;
    }
  }
  throw new Error('Impossible de generer une reference de commande. Reessayez.');
}

/**
 * Changement de statut. Le passage a CONFIRMEE decremente le stock
 * dans la meme transaction que l'ecriture des mouvements.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new Error('Commande introuvable.');
    if (order.status === status) return order;

    const wasStocked = ['CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'].includes(order.status);
    const willBeStocked = ['CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE'].includes(status);

    if (!wasStocked && willBeStocked) {
      for (const item of order.items) {
        await applyStockMovement(tx, {
          productId: item.productId,
          type: 'OUT',
          quantity: item.quantity,
          reason: 'Commande confirmee',
          reference: order.reference
        });
      }
    }

    if (wasStocked && status === 'ANNULEE') {
      for (const item of order.items) {
        await applyStockMovement(tx, {
          productId: item.productId,
          type: 'RETURN',
          quantity: item.quantity,
          reason: 'Commande annulee',
          reference: order.reference
        });
      }
    }

    return tx.order.update({ where: { id: orderId }, data: { status }, include: { items: true } });
  });
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getOrderByReference(reference: string) {
  return prisma.order.findUnique({ where: { reference }, include: { items: true } });
}

export async function getAllOrders(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}
