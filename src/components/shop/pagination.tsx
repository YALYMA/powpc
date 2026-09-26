'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Pagination({
  page,
  pageCount,
  basePath
}: {
  page: number;
  pageCount: number;
  basePath: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  if (pageCount <= 1) return null;

  function go(next: number) {
    const search = new URLSearchParams(params.toString());
    search.set('page', String(next));
    router.push(`${basePath}?${search.toString()}`);
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => go(page - 1)}>
        <ChevronLeft className="h-4 w-4" aria-hidden /> Precedent
      </Button>
      <span className="text-sm text-slate-600">
        Page {page} sur {pageCount}
      </span>
      <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => go(page + 1)}>
        Suivant <ChevronRight className="h-4 w-4" aria-hidden />
      </Button>
    </nav>
  );
}
