"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
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

  // For Add Zone modal
  const [showModal, setShowModal] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneCode, setZoneCode] = useState("");

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const data = await apiGet("/api/settings/zones");

      if (!Array.isArray(data)) {
        setZones([]);
      } else {
        setZones(data);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load zones");
      setZones([]);
    } finally {
      setLoading(false);
    }
  }

  async function createZone() {
    try {
      await apiPost("/api/settings/zones", {
        name: zoneName,
        code: zoneCode,
        locationId: "dummy-temp-id" // replace once Add Zone UI is done
      });

      setShowModal(false);
      setZoneName("");
      setZoneCode("");
      load();
    } catch (e: any) {
      alert("Failed to create zone: " + e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Zones</h1>
        <div className="flex gap-3">
          <Button onClick={load}>Refresh</Button>
          <Button onClick={() => setShowModal(true)}>+ Add Zone</Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 bg-red-100 border border-red-300 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* CARD */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Zone List</h2>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="text-sm text-zinc-400">Loading zones…</div>
          )}

          {!loading && zones.length === 0 && (
            <div className="text-sm text-zinc-500">No zones found.</div>
          )}

          {!loading && zones.length > 0 && (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-zinc-50 text-zinc-600">
                  <th className="py-2 px-2 text-left">Zone Name</th>
                  <th className="py-2 px-2 text-left">Code</th>
                  <th className="py-2 px-2 text-left">Location</th>
                </tr>
              </thead>

              <tbody>
                {zones.map((z) => (
                  <tr
                    key={z.id}
                    className="border-b last:border-0 hover:bg-zinc-50 transition"
                  >
                    <td className="py-2 px-2">{z.name}</td>
                    <td className="py-2 px-2">{z.code ?? "-"}</td>
                    <td className="py-2 px-2">{z.locationName ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ADD ZONE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">Add Zone</h2>

            <input
              type="text"
              placeholder="Zone Name"
              className="w-full border px-3 py-2 rounded"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Zone Code"
              className="w-full border px-3 py-2 rounded"
              value={zoneCode}
              onChange={(e) => setZoneCode(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={createZone}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
