'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { Button } from '@/components/ui/button';
import { WhatsappButton } from './whatsapp-button';
import { formatXof } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

export function CartView() {
  const { lines, subtotal, remove, setQuantity, ready } = useCart();

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <ShoppingBag className="mb-3 h-8 w-8 text-slate-400" aria-hidden />
        <h2 className="text-base font-semibold text-slate-900">Votre panier est vide</h2>
        <p className="mt-1 text-sm text-slate-600">
          Parcourez le catalogue ou verifiez la compatibilite avec votre PC.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/batteries"><Button>Voir les batteries</Button></Link>
          <Link href="/chargeurs"><Button variant="outline">Voir les chargeurs</Button></Link>
        </div>
      </div>
    );
  }

  const whatsappMessage =
    'Bonjour, je souhaite commander :\n' +
    lines.map((l) => `- ${l.name} (${l.reference}) x${l.quantity}`).join('\n') +
    `\nTotal produits : ${formatXof(subtotal)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {lines.map((line) => (
          <div
            key={line.productId}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
              <Image
                src={line.imageUrl ?? PLACEHOLDER_IMAGE}
                alt={line.name}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <Link
                href={`/produits/${line.slug}`}
                className="text-sm font-semibold text-slate-900 hover:text-brand-600"
              >
                {line.name}
              </Link>
              <p className="text-xs text-slate-500">Ref. {line.reference}</p>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex h-9 items-center rounded-lg border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    className="px-2.5 text-slate-600"
                    aria-label="Diminuer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    className="px-2.5 text-slate-600"
                    aria-label="Augmenter"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatXof(line.priceXof * line.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(line.productId)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label="Retirer du panier"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-sm font-semibold text-slate-900">Recapitulatif</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Sous-total</dt>
            <dd className="font-medium text-slate-900">{formatXof(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Livraison</dt>
            <dd className="text-slate-500">Calculee a l'etape suivante</dd>
          </div>
        </dl>

        <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-semibold text-slate-900">Total produits</span>
          <span className="text-lg font-bold text-slate-900">{formatXof(subtotal)}</span>
        </div>

        <Link href="/commande" className="mt-5 block">
          <Button className="w-full">Passer la commande</Button>
        </Link>
        <WhatsappButton
          className="mt-3 w-full"
          label="Commander sur WhatsApp"
          message={whatsappMessage}
        />
      </aside>
    </div>
  );
}
