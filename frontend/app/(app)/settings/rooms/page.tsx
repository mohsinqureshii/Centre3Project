'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Room = {
  id: string;
  name: string;
  locationId: string;
  zoneId: string;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const [roomsRes, locationsRes, zonesRes] = await Promise.all([
        apiGet('/settings/rooms'),
        apiGet('/settings/locations'),
        apiGet('/settings/zones'),
      ]);

      // If you later use locations/zones, keep them here
      setRooms(roomsRes);
    } catch (e: any) {
      setError(e.message || 'Failed to load rooms');
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
        <h1 className="text-2xl font-semibold">Rooms</h1>
        <Button onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="grid gap-3">
        {rooms.map((r) => (
          <Card key={r.id}>
            <CardHeader>{r.name}</CardHeader>
            <CardContent className="text-sm text-zinc-400">
              Location: {r.locationId} • Zone: {r.zoneId}
            </CardContent>
          </Card>
        ))}

        {!loading && rooms.length === 0 && (
          <div className="text-sm text-zinc-400">No rooms found.</div>
        )}
      </div>
    </div>
  );
}
