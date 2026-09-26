import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from './button';

export function EmptyState({
  title,
  description,
  actionLabel = 'Demander ce produit',
  actionHref = '/demande-disponibilite'
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
      <SearchX className="mb-3 h-8 w-8 text-slate-400" aria-hidden />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-600">{description}</p>
      <Link href={actionHref} className="mt-5">
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  );
}
