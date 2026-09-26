import type { OrderStatus, ProductStatus, RequestStatus } from '@prisma/client';

export const SITE = {
  name: 'PowerPC',
  slogan: "Trouvez l'energie de votre PC.",
  description:
    'Batteries et chargeurs compatibles pour ordinateurs portables. Recherche par modele, reference ou marque. Livraison au Senegal.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
};

export const CONTACT = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '221770000000',
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+221 77 000 00 00',
  email: process.env.NEXT_PUBLIC_EMAIL ?? 'contact@powerpc.sn'
};

/** Frais de livraison en FCFA, par zone. */
export const DELIVERY_FEES: Record<string, number> = {
  Dakar: 2000,
  'Dakar banlieue': 2500,
  Thies: 3000,
  Mbour: 3000,
  'Saint-Louis': 4000,
  Autre: 4000
};

export const CITIES = Object.keys(DELIVERY_FEES);

export function deliveryFee(city: string): number {
  return DELIVERY_FEES[city] ?? DELIVERY_FEES.Autre;
}

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  DISPONIBLE: 'Disponible',
  SUR_COMMANDE: 'Sur commande',
  INDISPONIBLE: 'Indisponible'
};

export const PRODUCT_STATUS_CLASS: Record<ProductStatus, string> = {
  DISPONIBLE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  SUR_COMMANDE: 'bg-amber-50 text-amber-700 ring-amber-200',
  INDISPONIBLE: 'bg-red-50 text-red-700 ring-red-200'
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmee',
  EN_PREPARATION: 'En preparation',
  EXPEDIEE: 'Expediee',
  LIVREE: 'Livree',
  ANNULEE: 'Annulee'
};

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  EN_ATTENTE: 'bg-slate-100 text-slate-700 ring-slate-200',
  CONFIRMEE: 'bg-brand-50 text-brand-700 ring-brand-200',
  EN_PREPARATION: 'bg-amber-50 text-amber-700 ring-amber-200',
  EXPEDIEE: 'bg-sky-50 text-sky-700 ring-sky-200',
  LIVREE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ANNULEE: 'bg-red-50 text-red-700 ring-red-200'
};

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  NOUVELLE: 'Nouvelle',
  EN_COURS: 'En cours',
  TRAITEE: 'Traitee',
  ANNULEE: 'Annulee'
};

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';
