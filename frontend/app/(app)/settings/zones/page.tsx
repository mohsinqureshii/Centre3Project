'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Zone = {
  id: string;
  name: string;
  locationId: string;
};

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const [zonesRes, locationsRes] = await Promise.all([
        apiGet('/settings/zones'),
        apiGet('/settings/locations'),
      ]);

      // Ensure array safety
      setZones(Array.isArray(zonesRes) ? zonesRes : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load zones');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Zones</h1>
        <Button onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="grid gap-3">
        {zones.map((z) => (
          <Card key={z.id}>
            <CardHeader>{z.name}</CardHeader>
            <CardContent className="text-sm text-zinc-400">
              Location ID: {z.locationId}
            </CardContent>
          </Card>
        ))}

        {!loading && zones.length === 0 && (
          <div className="text-sm text-zinc-400">No zones found.</div>
        )}
      </div>
    </div>
  );
}
