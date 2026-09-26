import 'server-only';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { getSession, type SessionPayload } from './session';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Redirige vers la connexion si aucune session valide.
 * Le JWT n'est qu'une preuve d'identite : le role et l'etat du compte sont
 * relus en base a chaque appel, pour qu'une desactivation ou un changement
 * de role prenne effet immediatement plutot que d'attendre l'expiration
 * du cookie (jusqu'a 7 jours).
 */
export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect('/connexion');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { isActive: true, role: true }
  });
  if (!user || !user.isActive) redirect('/connexion');

  return { ...session, role: user.role };
}

/** Autorisation basee sur le role - a appeler dans TOUTE action admin. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireUser();
  if (session.role !== 'ADMIN') redirect('/');
  return session;
}
