import 'server-only';
import { createHash } from 'node:crypto';

/**
 * Genere une signature Cloudinary cote serveur pour un upload direct
 * depuis le navigateur admin, sans jamais exposer CLOUDINARY_API_SECRET
 * au client (regle de securite #40 du cahier des charges).
 *
 * Flux : le navigateur demande une signature via une Server Action,
 * puis poste directement le fichier a l'API Cloudinary avec cette
 * signature. Le fichier ne transite jamais par notre serveur Next.js,
 * ce qui evite de saturer bodySizeLimit sur de grosses images.
 *
 * Algorithme de signature : les comptes Cloudinary crees recemment
 * exigent SHA-256 (Settings > Security > "Signature algorithm"), alors
 * que l'ancien defaut historique est SHA-1. Cloudinary verifie avec
 * l'algorithme configure sur VOTRE compte, invisible depuis le code :
 * si vous obtenez "Invalid Signature" alors que la chaine affichee dans
 * l'erreur est correcte, c'est presque toujours ce mismatch d'algorithme.
 * Reglable via CLOUDINARY_SIGNATURE_ALGORITHM ("sha256" par defaut, ou
 * "sha1" pour un compte plus ancien) sans toucher au code.
 */
function trimmedEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

function signatureAlgorithm(): 'sha1' | 'sha256' {
  const raw = trimmedEnv('CLOUDINARY_SIGNATURE_ALGORITHM')?.toLowerCase();
  return raw === 'sha1' ? 'sha1' : 'sha256';
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    trimmedEnv('CLOUDINARY_CLOUD_NAME') && trimmedEnv('CLOUDINARY_API_KEY') && trimmedEnv('CLOUDINARY_API_SECRET')
  );
}

export function signCloudinaryUpload(params: Record<string, string | number>): {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
} {
  // .trim() protege contre un piege frequent : une valeur collee depuis le
  // dashboard Cloudinary avec un espace ou un retour a la ligne en trop
  // dans le .env produit une signature invalide sans aucune erreur visible
  // a la lecture du fichier.
  const secret = trimmedEnv('CLOUDINARY_API_SECRET');
  const cloudName = trimmedEnv('CLOUDINARY_CLOUD_NAME');
  const apiKey = trimmedEnv('CLOUDINARY_API_KEY');
  if (!secret || !cloudName || !apiKey) {
    throw new Error('Configuration Cloudinary incomplete (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET).');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign: Record<string, string | number> = { ...params, timestamp };

  // Cloudinary exige les parametres (hors file/cloud_name/resource_type/
  // api_key/signature) tries alphabetiquement, concatenes en query string,
  // puis hashes avec le secret en suffixe.
  const signatureBase =
    Object.keys(toSign)
      .sort()
      .map((key) => `${key}=${toSign[key]}`)
      .join('&') + secret;

  const signature = createHash(signatureAlgorithm()).update(signatureBase).digest('hex');

  return { signature, timestamp, cloudName, apiKey };
}
