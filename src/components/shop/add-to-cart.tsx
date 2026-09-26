'use client';

import * as React from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, type CartLine } from '@/components/cart-provider';

export function AddToCart({ line, disabled }: { line: Omit<CartLine, 'quantity'>; disabled?: boolean }) {
  const { add } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  function handleAdd() {
    add(line, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex h-11 items-center rounded-xl border border-slate-300">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-full px-3 text-slate-600 hover:text-slate-900"
          aria-label="Diminuer la quantite"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(20, q + 1))}
          className="h-full px-3 text-slate-600 hover:text-slate-900"
          aria-label="Augmenter la quantite"
        >
          +
        </button>
      </div>

      <Button onClick={handleAdd} disabled={disabled} className="min-w-[180px]">
        {added ? (
          <>
            <Check className="h-4 w-4" aria-hidden /> Ajoute au panier
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" aria-hidden /> Ajouter au panier
          </>
        )}
      </Button>
    </div>
  );
}
