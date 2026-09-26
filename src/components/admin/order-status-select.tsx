'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/input';
import { updateOrderStatusAction } from '@/actions/order.actions';
import { ORDER_STATUS_LABEL } from '@/lib/constants';
import type { OrderStatus } from '@prisma/client';

const STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function change(next: string) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction({ orderId, status: next });
      if (!result.ok) setError(result.error ?? 'Erreur');
      else router.refresh();
    });
  }

  return (
    <div>
      <Select
        value={status}
        disabled={pending}
        onChange={(e) => change(e.target.value)}
        className="h-9 w-44 text-xs"
      >
        {STATUSES.map((value) => (
          <option key={value} value={value}>
            {ORDER_STATUS_LABEL[value]}
          </option>
        ))}
      </Select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
