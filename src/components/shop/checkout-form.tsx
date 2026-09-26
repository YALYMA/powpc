'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Label, Select, Textarea, FieldError } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart-provider';
import { createOrderAction } from '@/actions/order.actions';
import { CITIES, deliveryFee } from '@/lib/constants';
import { formatXof } from '@/lib/utils';

type Defaults = { firstName: string; lastName: string; phone: string; whatsapp: string };

export function CheckoutForm({ defaults }: { defaults: Defaults }) {
  const router = useRouter();
  const { lines, subtotal, clear, ready } = useCart();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [city, setCity] = React.useState(CITIES[0]);
  const [deliveryMethod, setDeliveryMethod] = React.useState('LIVRAISON');

  const shipping = deliveryMethod === 'RETRAIT' ? 0 : deliveryFee(city);
  const total = subtotal + shipping;

  if (ready && lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-600">Votre panier est vide.</p>
        <Link href="/batteries" className="mt-4 inline-block">
          <Button>Voir le catalogue</Button>
        </Link>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      whatsapp: String(formData.get('whatsapp') ?? ''),
      city: String(formData.get('city') ?? ''),
      district: String(formData.get('district') ?? ''),
      addressDetails: String(formData.get('addressDetails') ?? ''),
      deliveryMethod: String(formData.get('deliveryMethod') ?? 'LIVRAISON'),
      paymentMethod: String(formData.get('paymentMethod') ?? 'PAIEMENT_LIVRAISON'),
      note: String(formData.get('note') ?? ''),
      items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity }))
    };

    startTransition(async () => {
      const result = await createOrderAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        if ('fieldErrors' in result && result.fieldErrors) {
          setFieldErrors(result.fieldErrors as Record<string, string[]>);
        }
        return;
      }
      clear();
      router.push(`/commande/confirmation?ref=${result.reference}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Vos coordonnees</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">Prenom</Label>
              <Input id="firstName" name="firstName" defaultValue={defaults.firstName} required />
              <FieldError message={fieldErrors.firstName?.[0]} />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" defaultValue={defaults.lastName} required />
              <FieldError message={fieldErrors.lastName?.[0]} />
            </div>
            <div>
              <Label htmlFor="phone">Telephone</Label>
              <Input id="phone" name="phone" defaultValue={defaults.phone} placeholder="77 000 00 00" required />
              <FieldError message={fieldErrors.phone?.[0]} />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp (optionnel)</Label>
              <Input id="whatsapp" name="whatsapp" defaultValue={defaults.whatsapp} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Livraison</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="deliveryMethod">Mode de livraison</Label>
              <Select
                id="deliveryMethod"
                name="deliveryMethod"
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              >
                <option value="LIVRAISON">Livraison a domicile</option>
                <option value="RETRAIT">Retrait en boutique</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <Select id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="district">Quartier</Label>
              <Input id="district" name="district" placeholder="Sacre-Coeur, Medina..." required />
              <FieldError message={fieldErrors.district?.[0]} />
            </div>
            <div>
              <Label htmlFor="addressDetails">Complement d'adresse</Label>
              <Input id="addressDetails" name="addressDetails" placeholder="Repere, etage..." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Paiement</h2>
          <Select name="paymentMethod" defaultValue="PAIEMENT_LIVRAISON">
            <option value="PAIEMENT_LIVRAISON">Paiement a la livraison</option>
            <option value="WHATSAPP">Finaliser sur WhatsApp</option>
          </Select>
          <p className="mt-2 text-xs text-slate-500">
            Wave et Orange Money seront ajoutes prochainement.
          </p>

          <div className="mt-4">
            <Label htmlFor="note">Note pour le vendeur (optionnel)</Label>
            <Textarea id="note" name="note" rows={3} placeholder="Modele exact de votre PC, precisions..." />
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-sm font-semibold text-slate-900">Votre commande</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3">
              <span className="text-slate-600">
                {line.name} <span className="text-slate-500">x{line.quantity}</span>
              </span>
              <span className="whitespace-nowrap font-medium text-slate-900">
                {formatXof(line.priceXof * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Sous-total</dt>
            <dd className="font-medium">{formatXof(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Livraison</dt>
            <dd className="font-medium">{shipping === 0 ? 'Gratuit' : formatXof(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3">
            <dt className="font-semibold text-slate-900">Total</dt>
            <dd className="text-lg font-bold text-slate-900">{formatXof(total)}</dd>
          </div>
        </dl>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}

        <Button type="submit" className="mt-5 w-full" disabled={pending}>
          {pending ? 'Envoi en cours...' : 'Confirmer la commande'}
        </Button>
        <p className="mt-3 text-center text-xs text-slate-500">
          Le montant final est recalcule cote serveur.
        </p>
      </aside>
    </form>
  );
}
