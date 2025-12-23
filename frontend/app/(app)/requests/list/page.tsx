'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Request } from '@/lib/centre3Types';
import { StatusBadge } from '@/components/ui/badge';

export default function RequestsListPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/requests')
      .then(setRequests)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading requests…</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Requests</h1>

        <Link
          href="/requests/new"
          className="px-4 py-2 bg-black text-white rounded"
        >
          New Request
        </Link>
      </div>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Purpose</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-center">Visitors</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t">
              <td className="p-2">{req.purpose}</td>

              <td className="p-2">
                {req.locationName} / {req.zoneName} / {req.roomName}
              </td>

              <td className="p-2 text-center">
                {req.visitors?.length ?? 0}
              </td>

              <td className="p-2 text-center">
                <StatusBadge status={req.status} />
              </td>

              <td className="p-2 text-center space-x-3">
                <Link
                  href={`/requests/${req.id}`}
                  className="text-blue-600"
                >
                  View
                </Link>

                {req.status === 'DRAFT' && (
                  <Link
                    href={`/requests/new?id=${req.id}`}
                    className="text-green-600"
                  >
                    Edit
                  </Link>
                )}
              </td>
            </tr>
          ))}

          {requests.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
