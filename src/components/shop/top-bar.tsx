'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BatteryCharging, Menu, ShoppingCart, User, X } from 'lucide-react';
import { SearchBar } from './search-bar';
import { useCart } from '@/components/cart-provider';
import { cn } from '@/lib/utils';

const MOBILE_MENU_LINKS = [
  { href: '/compatibilite', label: 'Compatibilite' },
  { href: '/demande-disponibilite', label: 'Demande de disponibilite' },
  { href: '/suivi-commande', label: 'Suivre ma commande' },
  { href: '/contact', label: 'Contact' },
  { href: '/a-propos', label: 'A propos' }
];

export function TopBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setNotifOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Aller au contenu principal
      </a>

      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo visible uniquement sous le seuil ou la sidebar apparait */}
        <Link href="/" className="flex shrink-0 items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <BatteryCharging className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">PowerPC</span>
        </Link>

        <div className="hidden flex-1 sm:block">
          <SearchBar size="md" hideButton />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" aria-hidden />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                <p className="text-sm font-medium text-slate-900">Notifications</p>
                <p className="mt-2 text-xs text-slate-500">
                  Aucune notification pour le moment. Vous serez prevenu ici des mises a jour de vos
                  commandes.
                </p>
              </div>
            )}
          </div>

          <Link
            href={isAuthenticated ? '/compte' : '/connexion'}
            aria-label="Mon compte"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <User className="h-5 w-5" aria-hidden />
          </Link>

          <Link
            href="/panier"
            aria-label="Panier"
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Plus d'options"
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Recherche mobile : sous le seuil sm, la barre passe sur sa propre ligne */}
      <div className="border-t border-slate-100 px-4 py-2.5 sm:hidden">
        <SearchBar size="md" hideButton />
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {MOBILE_MENU_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-sm font-medium',
                pathname === item.href ? 'text-brand-700' : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
