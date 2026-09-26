'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { availabilityRequestSchema, requestStatusSchema } from '@/schemas/availability.schema';
import { createAvailabilityRequest, updateRequestStatus } from '@/services/availability.service';

export async function createAvailabilityRequestAction(raw: unknown) {
  const ip = await getClientIp();
  const limit = checkRateLimit(`availability:${ip}`, { max: 10, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false as const, error: 'Trop de demandes envoyees. Reessayez plus tard.' };
  }

  const parsed = availabilityRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: 'Formulaire invalide',
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const session = await getSession();
  await createAvailabilityRequest(parsed.data, session?.userId);
  revalidatePath('/admin/demandes');
  return { ok: true as const };
}

export async function updateRequestStatusAction(raw: unknown) {
  await requireAdmin();
  const parsed = requestStatusSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: 'Donnees invalides' };

  await updateRequestStatus(parsed.data.requestId, parsed.data.status, parsed.data.adminNote);
  revalidatePath('/admin/demandes');
  return { ok: true as const };
}
