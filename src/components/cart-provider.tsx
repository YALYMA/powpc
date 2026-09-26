'use client';

import * as React from 'react';

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  reference: string;
  priceXof: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  ready: boolean;
};

const STORAGE_KEY = 'powerpc_cart_v1';
const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // panier corrompu : on repart d'un panier vide
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // quota depasse : on ignore
    }
  }, [lines, ready]);

  const add = React.useCallback((line: Omit<CartLine, 'quantity'>, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((l) => l.productId === line.productId);
      if (existing) {
        return current.map((l) =>
          l.productId === line.productId ? { ...l, quantity: Math.min(20, l.quantity + quantity) } : l
        );
      }
      return [...current, { ...line, quantity }];
    });
  }, []);

  const remove = React.useCallback((productId: string) => {
    setLines((current) => current.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = React.useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      current.map((l) =>
        l.productId === productId ? { ...l, quantity: Math.max(1, Math.min(20, quantity)) } : l
      )
    );
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const value = React.useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.priceXof * l.quantity, 0);
    return { lines, count, subtotal, add, remove, setQuantity, clear, ready };
  }, [lines, add, remove, setQuantity, clear, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error('useCart doit etre utilise dans un CartProvider');
  return context;
}
