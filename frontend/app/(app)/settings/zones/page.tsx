"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Zone = {
  id: string;
  name: string;
  code?: string;
  locationName: string;
};

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Zones
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
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Zones</h1>

        <div className="flex gap-3">
          <Button onClick={load}>Refresh</Button>
          <Button variant="default">+ Add Zone</Button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 bg-red-100 border border-red-300 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* TABLE CARD */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Zone List</h2>
        </CardHeader>

        <CardContent>
          {/* Loading */}
          {loading && (
            <div className="text-sm text-zinc-400">Loading zones…</div>
          )}

          {/* Empty */}
          {!loading && zones.length === 0 && (
            <div className="text-sm text-zinc-500">No zones found.</div>
          )}

          {/* TABLE */}
          {!loading && zones.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-zinc-600">
                  <th className="py-2 px-2">Zone Name</th>
                  <th className="py-2 px-2">Code</th>
                  <th className="py-2 px-2">Location</th>
                </tr>
              </thead>

              <tbody>
                {zones.map((z) => (
                  <tr
                    key={z.id}
                    className="border-b last:border-0 hover:bg-zinc-50 transition"
                  >
                    <td className="py-2 px-2">{z.name}</td>
                    <td className="py-2 px-2">{z.code || "-"}</td>
                    <td className="py-2 px-2">{z.locationName}</td>
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
