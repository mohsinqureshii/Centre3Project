"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Location = { id: string; siteName?: string; siteCode?: string; country?: string; city?: string };
type Zone = { id: string; name?: string; locationId?: string };
type Room = {
  id: string;
  name?: string;
  roomName?: string;
  code?: string;
  roomCode?: string;
  locationId?: string;
  zoneId?: string;
  locationName?: string;
  zoneName?: string;
  isActive?: boolean;
};

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-base font-semibold">{title}</div>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [locationId, setLocationId] = useState("");
  const [zoneId, setZoneId] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [roomsRes, locationsRes, zonesRes] = await Promise.all([
        apiGet("/api/settings/rooms"),
        apiGet("/api/settings/locations"),
        apiGet("/api/settings/zones"),
      ]);

      setRooms(Array.isArray(roomsRes) ? roomsRes : []);
      setLocations(Array.isArray(locationsRes) ? locationsRes : []);
      setZones(Array.isArray(zonesRes) ? zonesRes : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load rooms");
      setRooms([]);
      setLocations([]);
      setZones([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredZones = useMemo(() => {
    if (!locationId) return zones;
    return zones.filter((z) => !z.locationId || z.locationId === locationId);
  }, [zones, locationId]);

  const canSubmit = useMemo(() => {
    return roomName.trim() && locationId.trim() && zoneId.trim();
  }, [roomName, locationId, zoneId]);

  function resetForm() {
    setRoomName("");
    setRoomCode("");
    setLocationId("");
    setZoneId("");
  }

  async function createRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        // send both variants so backend accepts whichever it expects
        name: roomName,
        roomName,
        code: roomCode || null,
        roomCode: roomCode || null,
        locationId,
        zoneId,
      };

      const created = await apiPost("/api/settings/rooms", payload);
      setRooms((prev) => [created, ...prev]);
      setOpen(false);
      resetForm();
    } catch (e: any) {
      setError(e?.message || "Failed to create room");
    } finally {
      setSaving(false);
    }
  }

  function locLabel(l: Location) {
    const left = l.siteName || l.siteCode || "Location";
    const right = [l.country, l.city].filter(Boolean).join(" • ");
    return right ? `${left} (${right})` : left;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Rooms</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Refresh</Button>
          <Button onClick={() => setOpen(true)}>Add Room</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="font-semibold">Room List</CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left">
              <tr>
                <th className="p-3">Room</th>
                <th className="p-3">Code</th>
                <th className="p-3">Location</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    Loading rooms…
                  </td>
                </tr>
              )}

              {!loading && rooms.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    No rooms found
                  </td>
                </tr>
              )}

              {!loading &&
                rooms.map((r) => {
                  const name = r.name || r.roomName || "—";
                  const code = r.code || r.roomCode || "—";
                  const loc = r.locationName || (r.locationId ? r.locationId : "—");
                  const zone = r.zoneName;
                  const active = r.isActive !== false;
                  console.log(zone)

                  return (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="p-3">{name}</td>
                      <td className="p-3 font-mono text-xs">{code}</td>
                      <td className="p-3">{loc}</td>
                      <td className="p-3">{zone}</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {active ? "Active" : "Disabled"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal
        open={open}
        title="Add Room"
        onClose={() => {
          if (!saving) setOpen(false);
        }}
      >
        <form onSubmit={createRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Room Name</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Room Code (optional)</label>
            <input
              className="w-full rounded-lg border px-3 py-2 font-mono"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={locationId}
              onChange={(e) => {
                setLocationId(e.target.value);
                setZoneId("");
              }}
            >
              <option value="">Select location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {locLabel(l)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Zone</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
            >
              <option value="">Select zone</option>
              {filteredZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name || z.id}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || saving}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
