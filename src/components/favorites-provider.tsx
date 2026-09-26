'use client';

import * as React from 'react';

type FavoritesContextValue = {
  ids: string[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  ready: boolean;
};

const STORAGE_KEY = 'powerpc_favorites_v1';
const FavoritesContext = React.createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      // liste corrompue : on repart d'une liste vide
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // quota depasse : on ignore
    }
  }, [ids, ready]);

  const toggle = React.useCallback((productId: string) => {
    setIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  }, []);

  const has = React.useCallback((productId: string) => ids.includes(productId), [ids]);

  const value = React.useMemo<FavoritesContextValue>(
    () => ({ ids, count: ids.length, has, toggle, ready }),
    [ids, has, toggle, ready]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = React.useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites doit etre utilise dans un FavoritesProvider');
  return context;
}
