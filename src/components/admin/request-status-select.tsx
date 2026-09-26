'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/input';
import { updateRequestStatusAction } from '@/actions/availability.actions';
import { REQUEST_STATUS_LABEL } from '@/lib/constants';
import type { RequestStatus } from '@prisma/client';

const STATUSES = Object.keys(REQUEST_STATUS_LABEL) as RequestStatus[];

export function RequestStatusSelect({
  requestId,
  status
}: {
  requestId: string;
  status: RequestStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      className="h-9 w-36 text-xs"
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          await updateRequestStatusAction({ requestId, status: next });
          router.refresh();
        });
      }}
    >
      {STATUSES.map((value) => (
        <option key={value} value={value}>
          {REQUEST_STATUS_LABEL[value]}
        </option>
      ))}
    </Select>
  );
}
