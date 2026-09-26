'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart-provider';
import { useFavorites } from '@/components/favorites-provider';

export function MobileTabBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const { count: cartCount, ready: cartReady } = useCart();
  const { count: favCount, ready: favReady } = useFavorites();

  const items = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/catalogue', label: 'Catalogue', icon: LayoutGrid },
    { href: '/favoris', label: 'Favoris', icon: Heart, badge: favReady ? favCount : 0 },
    { href: '/panier', label: 'Panier', icon: ShoppingCart, badge: cartReady ? cartCount : 0 },
    { href: isAuthenticated ? '/compte' : '/connexion', label: 'Compte', icon: User }
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Navigation principale"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
                  active ? 'text-brand-700' : 'text-slate-500'
                )}
              >
                <span className="relative">
                  <item.icon className="h-5 w-5" aria-hidden />
                  {Boolean(item.badge) && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
