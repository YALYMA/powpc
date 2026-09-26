import 'server-only';
import { randomBytes, createHash } from 'node:crypto';

/**
 * Genere un jeton opaque et son empreinte a stocker en base.
 * On ne stocke jamais le jeton en clair : si la base fuite, les jetons
 * de reinitialisation en attente restent inutilisables (comme des mots
 * de passe hashes).
 */
export function generateToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
