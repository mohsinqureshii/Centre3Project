"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Zone = {
  id: string;
  name: string;
  locationName: string;
};

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/settings/zones");
      setZones(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Failed to load zones");
      setZones([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Zones</h1>
        <Button onClick={load}>Refresh</Button>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Card>
        <CardHeader>
          <Button className="mt-2 w-fit">Add Zone</Button>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="text-sm text-zinc-400">Loading zones…</div>
          )}

          {!loading && zones.length === 0 && (
            <div className="text-sm text-zinc-400">No zones found.</div>
          )}

          {!loading && zones.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.id} className="border-b last:border-0">
                    <td className="py-2">{z.name}</td>
                    <td className="py-2">{z.locationName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
