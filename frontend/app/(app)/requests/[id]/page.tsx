'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Request } from '@/lib/centre3Types';
import { StatusBadge } from '@/components/ui/badge';

export default function RequestDetailsPage({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const all = await apiGet('/requests');

        if (!Array.isArray(all)) {
          throw new Error('Invalid response from /requests');
        }

        const found = all.find((r: any) => r.id === params.id);

        if (mounted) {
          setRequest(found ?? null);
        }
      } catch (err: any) {
        console.error('Request details error:', err);
        if (mounted) {
          setError('Failed to load request');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) {
    return <div className="p-6">Loading request…</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/requests" className="underline">
          Back to requests
        </Link>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6">
        <p>Request not found</p>
        <Link href="/requests" className="underline">
          Back to requests
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Request Details</h1>
        <StatusBadge status={request.status} />
      </div>

      <div>
        <h2 className="font-semibold">Purpose</h2>
        <p>{request.purpose}</p>
      </div>

      <div>
        <h2 className="font-semibold">Location</h2>
        <p>
          {request.locationName || '-'} / {request.zoneName || '-'} /{' '}
          {request.roomName || '-'}
        </p>
      </div>

      <div>
        <h2 className="font-semibold">Visitors</h2>
        {request.visitors.length === 0 ? (
          <p>No visitors</p>
        ) : (
          <ul className="list-disc ml-6">
            {request.visitors.map((v, i) => (
              <li key={i}>
                {v.fullName} — {v.idNumber}
                {v.company && ` (${v.company})`}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4">
        <Link href="/requests" className="underline">
          Back to list
        </Link>

        {request.status === 'DRAFT' && (
          <Link
            href={`/requests/new?id=${request.id}`}
            className="text-green-600"
          >
            Edit Draft
          </Link>
        )}
      </div>
    </div>
  );
}
