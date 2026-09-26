import 'server-only';

/**
 * Point d'integration unique pour l'envoi d'emails transactionnels.
 *
 * Aucun fournisseur d'email n'est configure dans ce projet (pas de cle API
 * Resend/SendGrid/SMTP fournie). Cette fonction journalise le lien de
 * reinitialisation cote serveur pour que le flux reste testable de bout en
 * bout en developpement, mais N'ENVOIE RIEN en production tant qu'un vrai
 * transport n'est pas branche ici.
 *
 * Pour activer les emails reels, remplacer le corps de cette fonction par
 * un appel a votre fournisseur, par exemple avec Resend :
 *
 *   import { Resend } from 'resend';
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({
 *     from: 'PowerPC <no-reply@powerpc.sn>',
 *     to: params.to,
 *     subject: 'Reinitialisation de votre mot de passe',
 *     html: `<p>Cliquez ici pour reinitialiser votre mot de passe : <a href="${params.resetUrl}">${params.resetUrl}</a></p>`
 *   });
 */
export async function sendPasswordResetEmail(params: { to: string; resetUrl: string }): Promise<void> {
  if (process.env.NODE_ENV === 'production' && !process.env.RESEND_API_KEY) {
    console.warn(
      '[PowerPC] Aucun fournisseur email configure : le lien de reinitialisation n\'a pas ete envoye a',
      params.to,
      '. Branchez un vrai transport dans src/lib/mailer.ts.'
    );
    return;
  }

  console.log(`[PowerPC] Lien de reinitialisation pour ${params.to} : ${params.resetUrl}`);
}
