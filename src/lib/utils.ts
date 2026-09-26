import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Les montants sont stockes en entiers FCFA (le XOF n'a pas de decimales). */
export function formatXof(amount: number): string {
  return new Intl.NumberFormat('fr-SN', { maximumFractionDigits: 0 }).format(amount) + ' FCFA';
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Normalise une saisie utilisateur pour tolerer les variations (HT03XL / ht 03 xl). */
export function normalizeSearch(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Serialise un objet pour un bloc <script type="application/ld+json">.
 * JSON.stringify seul laisse passer "</script>" tel quel si une valeur
 * (ex: un nom de produit saisi par l'admin) contient cette sous-chaine,
 * ce qui cloturerait prematurement la balise et permettrait d'injecter
 * du HTML/JS dans la page. On echappe "<" pour empecher toute fermeture
 * de balise, ce qui reste un JSON valide (les navigateurs l'interpretent
 * correctement dans un contexte JSON-LD).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function orderReference(): string {
  const now = new Date();
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, '');
  // 6 caracteres alphanumeriques : la collision entre deux commandes
  // la meme journee devient negligeable (36^6 combinaisons).
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0');
  return `PPC-${stamp}-${rand}`;
}
