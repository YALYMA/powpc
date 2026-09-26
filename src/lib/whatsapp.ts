import { CONTACT } from './constants';

/** Construit un lien wa.me avec message prerempli. Aucune cle secrete cote client. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappMessage(params: {
  name: string;
  reference: string;
  compatibleWith?: string | null;
}): string {
  const suffix = params.compatibleWith ? ` pour ${params.compatibleWith}` : '';
  return `Bonjour, je suis interesse par ${params.name} (ref. ${params.reference})${suffix}. Est-elle disponible ?`;
}
