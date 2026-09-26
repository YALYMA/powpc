import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Laptop,
  Tags,
  Boxes,
  Inbox,
  ExternalLink
} from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { logoutAction } from '@/actions/auth.actions';
import { LogoutButton } from '@/components/shop/auth-forms';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/demandes', label: 'Demandes', icon: Inbox },
  { href: '/admin/laptops', label: 'Modeles PC', icon: Laptop },
  { href: '/admin/marques', label: 'Marques', icon: Tags },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/stock', label: 'Stock', icon: Boxes }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-60 shrink-0 border-r border-slate-800 bg-slate-900 lg:block">
        <div className="flex h-16 items-center px-5 text-white">
          <span className="font-semibold">PowerPC Admin</span>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <link.icon className="h-4 w-4" aria-hidden />
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Voir la boutique
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-2 lg:hidden">
            <Users className="h-4 w-4 text-slate-400" aria-hidden />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-slate-600">{session.email}</span>
            <LogoutButton action={logoutAction} />
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
