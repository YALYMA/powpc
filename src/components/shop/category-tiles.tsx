import Link from 'next/link';
import { BatteryCharging, Plug, Wrench } from 'lucide-react';

const CATEGORIES = [
  {
    href: '/batteries',
    label: 'Batteries',
    icon: BatteryCharging,
    description: 'Batteries internes et externes pour PC portables'
  },
  {
    href: '/chargeurs',
    label: 'Chargeurs',
    icon: Plug,
    description: 'Chargeurs 45W a 120W, connecteurs classiques et USB-C'
  },
  {
    href: '/compatibilite',
    label: 'Compatibilite',
    icon: Wrench,
    description: 'Trouvez le produit adapte a votre modele de PC'
  }
];

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {CATEGORIES.map((category) => (
        <Link
          key={category.href}
          href={category.href}
          className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-brand-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <category.icon className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-900">{category.label}</p>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{category.description}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:underline">
            Voir tout <span aria-hidden>&rarr;</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
