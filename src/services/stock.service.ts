import 'server-only';
import { Prisma, type StockMovementType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Seule porte d'entree pour modifier un stock.
 * Toute variation ecrit un StockMovement : on sait toujours pourquoi le stock a bouge.
 *
 * - IN / RETURN  : ajoutent au stock.
 * - OUT          : retirent du stock ; rejete si le stock disponible est insuffisant.
 * - ADJUSTMENT   : ne s'ADDITIONNE PAS au stock existant, il le REMPLACE par la
 *                  valeur donnee (ex: "le comptage physique dit 7"). C'est la
 *                  seule maniere de corriger une erreur d'inventaire a la baisse.
 *
 * Le statut est recalcule a chaque mouvement, dans les deux sens :
 * un reapprovisionnement doit pouvoir repasser un produit en DISPONIBLE.
 * Le SELECT ... FOR UPDATE (via $queryRaw dans une transaction) verrouille
 * la ligne le temps du calcul pour eviter qu'une vente concurrente ne fasse
 * passer le stock sous zero (race condition sur deux commandes simultanees).
 */
export async function applyStockMovement(
  tx: Prisma.TransactionClient,
  params: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    reason?: string;
    reference?: string;
  }
) {
  if (params.quantity <= 0) {
    throw new Error('La quantite doit etre superieure a zero.');
  }

  const locked = await tx.$queryRaw<
    Array<{ stock: number; status: 'DISPONIBLE' | 'SUR_COMMANDE' | 'INDISPONIBLE' }>
  >`
    SELECT stock, status FROM "Product" WHERE id = ${params.productId} FOR UPDATE
  `;
  const current = locked[0];
  if (!current) throw new Error('Produit introuvable.');

  let nextStock: number;
  if (params.type === 'ADJUSTMENT') {
    nextStock = params.quantity;
  } else if (params.type === 'OUT') {
    if (current.stock < params.quantity) {
      throw new Error(`Stock insuffisant (disponible : ${current.stock}).`);
    }
    nextStock = current.stock - params.quantity;
  } else {
    nextStock = current.stock + params.quantity;
  }

  // INDISPONIBLE est une decision explicite de l'admin (produit retire de la
  // vente) : on ne l'ecrase jamais automatiquement. Seule la bascule entre
  // DISPONIBLE et SUR_COMMANDE suit le stock.
  const nextStatus =
    current.status === 'INDISPONIBLE' ? 'INDISPONIBLE' : nextStock <= 0 ? 'SUR_COMMANDE' : 'DISPONIBLE';

  const product = await tx.product.update({
    where: { id: params.productId },
    data: { stock: nextStock, status: nextStatus }
  });

  await tx.stockMovement.create({
    data: {
      productId: params.productId,
      type: params.type,
      quantity: params.quantity,
      reason: params.reason,
      reference: params.reference
    }
  });

  return product;
}

export async function adjustStock(params: {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason?: string;
}) {
  return prisma.$transaction((tx) => applyStockMovement(tx, params));
}

export async function getMovements(productId?: string, limit = 50) {
  return prisma.stockMovement.findMany({
    where: productId ? { productId } : undefined,
    include: { product: { select: { name: true, reference: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

export async function getLowStockProducts() {
  return prisma.$queryRaw<Array<{ id: string; name: string; reference: string; stock: number }>>`
    SELECT id, name, reference, stock
    FROM "Product"
    WHERE "isActive" = true AND stock <= "lowStockThreshold"
    ORDER BY stock ASC
    LIMIT 20
  `;
}
