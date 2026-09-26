'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { createSessionCookie, destroySessionCookie } from '@/lib/session';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { generateToken, hashToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mailer';
import { SITE } from '@/lib/constants';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema
} from '@/schemas/auth.schema';

export type ActionResult = { ok: boolean; error?: string; fieldErrors?: Record<string, string[]> };

export async function registerAction(raw: unknown): Promise<ActionResult> {
  const ip = await getClientIp();
  const limit = checkRateLimit(`register:${ip}`, { max: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false, error: 'Trop de tentatives. Reessayez dans quelques minutes.' };
  }

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Formulaire invalide', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { ok: false, error: 'Un compte existe deja avec cet email.' };

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: await hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone
    }
  });

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName
  });

  return { ok: true };
}

export async function loginAction(raw: unknown): Promise<ActionResult> {
  const ip = await getClientIp();
  // Limite par IP ET par email cible : freine aussi bien le bourrinage large
  // que le ciblage d'un compte precis depuis plusieurs IP.
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Formulaire invalide' };

  const ipLimit = checkRateLimit(`login-ip:${ip}`, { max: 20, windowMs: 15 * 60 * 1000 });
  const emailLimit = checkRateLimit(`login-email:${parsed.data.email}`, {
    max: 6,
    windowMs: 15 * 60 * 1000
  });
  if (!ipLimit.allowed || !emailLimit.allowed) {
    return { ok: false, error: 'Trop de tentatives. Reessayez dans quelques minutes.' };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Message volontairement generique : on ne revele pas si l'email existe.
  if (!user || !user.isActive) return { ok: false, error: 'Email ou mot de passe incorrect.' };

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return { ok: false, error: 'Email ou mot de passe incorrect.' };

  await createSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName
  });

  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await destroySessionCookie();
  redirect('/');
}

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function requestPasswordResetAction(raw: unknown): Promise<ActionResult> {
  const ip = await getClientIp();
  const limit = checkRateLimit(`reset-request:${ip}`, { max: 5, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false, error: 'Trop de demandes. Reessayez dans quelques minutes.' };
  }

  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Email invalide' };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // Meme reponse que l'utilisateur existe ou non : on ne revele jamais
  // si un email est enregistre (evite l'enumeration de comptes).
  if (user && user.isActive) {
    const { token, hash } = generateToken();
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hash, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) }
    });

    const resetUrl = `${SITE.url}/reinitialiser-mot-de-passe/${token}`;
    await sendPasswordResetEmail({ to: user.email, resetUrl });
  }

  return { ok: true };
}

export async function resetPasswordAction(raw: unknown): Promise<ActionResult> {
  const ip = await getClientIp();
  const limit = checkRateLimit(`reset-confirm:${ip}`, { max: 10, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false, error: 'Trop de tentatives. Reessayez plus tard.' };
  }

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Formulaire invalide', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const tokenHash = hashToken(parsed.data.token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (!record || record.usedAt || record.expiresAt < new Date() || !record.user.isActive) {
    return { ok: false, error: 'Ce lien est invalide ou a expire. Demandez-en un nouveau.' };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: await hashPassword(parsed.data.password) }
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() }
    }),
    // Un changement de mot de passe invalide tous les autres jetons en attente
    // pour ce compte : evite qu'un lien plus ancien reste exploitable.
    prisma.passwordResetToken.updateMany({
      where: { userId: record.userId, usedAt: null },
      data: { usedAt: new Date() }
    })
  ]);

  return { ok: true };
}
