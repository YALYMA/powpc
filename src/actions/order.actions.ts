'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { orderSchema, orderStatusSchema } from '@/schemas/order.schema';
import { createOrder, updateOrderStatus } from '@/services/order.service';

export async function createOrderAction(raw: unknown) {
  const ip = await getClientIp();
  const limit = checkRateLimit(`order:${ip}`, { max: 15, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false as const, error: 'Trop de commandes envoyees. Reessayez plus tard.' };
  }

  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: 'Formulaire invalide',
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const session = await getSession();

  try {
    const order = await createOrder(parsed.data, session?.userId);
    revalidatePath('/admin/commandes');
    return { ok: true as const, reference: order.reference, totalXof: order.totalXof };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Impossible de creer la commande.'
    };
  }
}

export async function updateOrderStatusAction(raw: unknown) {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: 'Donnees invalides' };

  try {
    await updateOrderStatus(parsed.data.orderId, parsed.data.status);
    revalidatePath('/admin/commandes');
    revalidatePath('/admin');
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Mise a jour impossible.'
    };
  }
}
