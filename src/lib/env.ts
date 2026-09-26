import { z } from 'zod';

/**
 * Valide les variables d'environnement critiques au demarrage du serveur.
 * Objectif : echouer bruyamment au boot plutot que silencieusement en
 * production (middleware qui deconnecte tout le monde, WhatsApp qui pointe
 * vers un numero factice, etc.).
 */
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL est requis'),
  AUTH_SECRET: z
    .string()
    .min(32, 'AUTH_SECRET doit faire au moins 32 caracteres (openssl rand -base64 32)'),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(/^[0-9]{9,15}$/, 'NEXT_PUBLIC_WHATSAPP_NUMBER doit etre un numero sans espaces ni +')
    .optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional()
});

export function validateEnv(): void {
  const result = envSchema.safeParse(process.env);
  if (result.success) return;

  const messages = result.error.errors.map((e) => `  - ${e.path.join('.')}: ${e.message}`).join('\n');
  const banner = `\n[PowerPC] Configuration invalide :\n${messages}\n`;

  if (process.env.NODE_ENV === 'production') {
    // En production on bloque volontairement le demarrage : mieux vaut un
    // deploiement qui ne demarre pas qu'un site en ligne mal configure.
    throw new Error(banner);
  }
  // En developpement on avertit sans bloquer, pour ne pas gener l'onboarding
  // avant que .env soit entierement rempli (ex: WhatsApp encore vide).
  console.warn(banner);
}
