'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';
import { SITE } from '@/lib/constants';

/**
 * Bouton WhatsApp flottant. Le message est prerempli avec la page en cours,
 * pour que le vendeur sache de quel produit/page le client parle.
 * Sur mobile il est remonte au-dessus de la barre d'onglets fixe (bottom-20).
 */
export function FloatingWhatsapp() {
  const pathname = usePathname();

  const message =
    pathname === '/'
      ? "Bonjour, j'ai besoin d'aide pour trouver une batterie ou un chargeur pour mon PC."
      : `Bonjour, j'ai besoin d'aide concernant cette page : ${SITE.url}${pathname}`;

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Besoin d'aide ? Ecrivez-nous sur WhatsApp"
      className="fixed right-4 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:bottom-6 lg:right-6"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span>Besoin d'aide ?</span>
    </a>
  );
}
