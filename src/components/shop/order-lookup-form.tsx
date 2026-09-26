'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function OrderLookupForm() {
  const router = useRouter();
  const [reference, setReference] = React.useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = reference.trim();
    if (!trimmed) return;
    router.push(`/suivi-commande/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="reference">Reference de commande</Label>
        <Input
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="PPC-260918-AB12CD"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Voir ma commande
      </Button>
    </form>
  );
}
