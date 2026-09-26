'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Input, Label, Select, Textarea, FieldError } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createAvailabilityRequestAction } from '@/actions/availability.actions';

export function AvailabilityForm() {
  const [pending, startTransition] = React.useTransition();
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  if (done) {
    return (
      <div className="py-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden />
        <h2 className="mt-4 text-base font-semibold text-slate-900">
          Votre demande a bien ete enregistree
        </h2>
        <p className="mt-2 text-sm text-slate-600">Nous vous contacterons des que possible.</p>
        <Button className="mt-6" variant="outline" onClick={() => setDone(false)}>
          Envoyer une autre demande
        </Button>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      const result = await createAvailabilityRequestAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        if ('fieldErrors' in result && result.fieldErrors) {
          setFieldErrors(result.fieldErrors as Record<string, string[]>);
        }
        return;
      }
      setDone(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="customerName">Nom complet</Label>
        <Input id="customerName" name="customerName" required />
        <FieldError message={fieldErrors.customerName?.[0]} />
      </div>
      <div>
        <Label htmlFor="phone">Telephone</Label>
        <Input id="phone" name="phone" placeholder="77 000 00 00" required />
        <FieldError message={fieldErrors.phone?.[0]} />
      </div>
      <div>
        <Label htmlFor="whatsapp">WhatsApp (optionnel)</Label>
        <Input id="whatsapp" name="whatsapp" />
      </div>
      <div>
        <Label htmlFor="type">Type de produit</Label>
        <Select id="type" name="type" defaultValue="BATTERIE">
          <option value="BATTERIE">Batterie</option>
          <option value="CHARGEUR">Chargeur</option>
          <option value="AUTRE">Autre piece</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="brandName">Marque du PC</Label>
        <Input id="brandName" name="brandName" placeholder="HP, Dell, Lenovo..." required />
        <FieldError message={fieldErrors.brandName?.[0]} />
      </div>
      <div>
        <Label htmlFor="laptopModel">Modele du PC</Label>
        <Input id="laptopModel" name="laptopModel" placeholder="250 G7, Inspiron 15 3567..." required />
        <FieldError message={fieldErrors.laptopModel?.[0]} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="knownRef">Reference connue (optionnel)</Label>
        <Input id="knownRef" name="knownRef" placeholder="HT03XL, L18M3P71..." />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="imageUrl">Lien vers une photo (optionnel)</Label>
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
        <FieldError message={fieldErrors.imageUrl?.[0]} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={4} placeholder="Precisions utiles..." />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 sm:col-span-2">{error}</p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? 'Envoi...' : 'Envoyer la demande'}
        </Button>
      </div>
    </form>
  );
}
