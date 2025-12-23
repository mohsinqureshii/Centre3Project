// components/ui/badge.tsx
import clsx from 'clsx';
import { RequestStatus } from '@/lib/centre3Types';

const statusClasses: Record<RequestStatus, string> = {
  DRAFT: 'bg-gray-200 text-gray-800',
  SUBMITTED: 'bg-blue-200 text-blue-800',
  APPROVED: 'bg-green-200 text-green-800',
  REJECTED: 'bg-red-200 text-red-800',
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={clsx(
        'px-2 py-1 rounded text-xs font-semibold uppercase',
        statusClasses[status]
      )}
    >
      {status}
    </span>
  );
}
