'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BatteryCharging,
  Home,
  LayoutGrid,
  Heart,
  Package,
  Wrench,
  MessageCircleQuestion,
  Info,
  Phone,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/components/favorites-provider';

const MAIN_NAV = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/catalogue', label: 'Catalogue', icon: LayoutGrid },
  { href: '/compatibilite', label: 'Compatibilite', icon: Wrench },
  { href: '/favoris', label: 'Favoris', icon: Heart }
];

const HELP_NAV = [
  { href: '/demande-disponibilite', label: 'Demande de disponibilite', icon: MessageCircleQuestion },
  { href: '/suivi-commande', label: 'Suivre ma commande', icon: Package },
  { href: '/contact', label: 'Contact', icon: Phone },
  { href: '/a-propos', label: 'A propos', icon: Info }
];

export function Sidebar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const { count } = useFavorites();

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <BatteryCharging className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-lg font-semibold tracking-tight text-slate-900">PowerPC</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {MAIN_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
                  isActive(item.href)
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-[18px] w-[18px]" aria-hidden />
                  {item.label}
                </span>
                {item.href === '/favoris' && count > 0 && (
                  <span
                    className={cn(
                      'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold',
                      isActive(item.href) ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 px-3 text-xs font-medium uppercase tracking-wide text-slate-400">
          Assistance
        </p>
        <ul className="mt-1 space-y-1">
          {HELP_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
                  isActive(item.href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="h-[18px] w-[18px]" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-6 space-y-1 border-t border-slate-100 pt-4">
          <li>
            <Link
              href={isAuthenticated ? '/compte' : '/connexion'}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
                isActive('/compte')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Package className="h-[18px] w-[18px]" aria-hidden />
              {isAuthenticated ? 'Mes commandes' : 'Se connecter'}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-3">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white">
          <Truck className="h-6 w-6" aria-hidden />
          <p className="mt-2 text-sm font-semibold">Livraison rapide</p>
          <p className="text-xs text-white/80">Partout au Senegal</p>
          <Link
            href="/a-propos"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white hover:underline"
          >
            En savoir plus <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
