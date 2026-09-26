import { cn } from '@/lib/utils';
import { PRODUCT_STATUS_CLASS, PRODUCT_STATUS_LABEL } from '@/lib/constants';
import type { ProductStatus } from '@prisma/client';

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  const dot =
    status === 'DISPONIBLE'
      ? 'bg-emerald-500'
      : status === 'SUR_COMMANDE'
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <Badge className={PRODUCT_STATUS_CLASS[status]}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {PRODUCT_STATUS_LABEL[status]}
    </Badge>
  );
}
