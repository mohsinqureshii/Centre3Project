"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Location = {
  id: string;
  siteName: string;
};

type Zone = {
  id: string;
  name: string;
  locationId: string;
};

type Room = {
  id: string;
  name: string;
  code?: string;
  zone: Zone;
  location: Location;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [filteredZones, setFilteredZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    locationId: "",
    zoneId: "",
    name: "",
    code: "",
  });

  /* =====================================================
     LOAD DATA
  ===================================================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsRes, locationsRes, zonesRes] = await Promise.all([
          api.get("/settings/rooms"),
          api.get("/settings/locations"),
          api.get("/settings/zones"),
        ]);

        setRooms(roomsRes.data);
        setLocations(locationsRes.data);
        setZones(zonesRes.data);
      } catch (err) {
        console.error("Failed loading rooms data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =====================================================
     FILTER ZONES BY LOCATION
  ===================================================== */
  useEffect(() => {
    if (!form.locationId) {
      setFilteredZones([]);
      return;
    }

    setFilteredZones(
      zones.filter((z) => z.locationId === form.locationId)
    );
  }, [form.locationId, zones]);

  /* =====================================================
     CREATE ROOM
  ===================================================== */
  const createRoom = async () => {
    const { locationId, zoneId, name } = form;
    if (!locationId || !zoneId || !name) return;

    try {
      const res = await api.post("/settings/rooms", form);
      setRooms((r) => [...r, res.data]);
      setShowModal(false);
      setForm({ locationId: "", zoneId: "", name: "", code: "" });
    } catch (err) {
      console.error("Create room failed", err);
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Rooms</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Zone</th>
              <th className="p-3 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Loading rooms...
                </td>
              </tr>
            )}

            {!loading && rooms.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No rooms found
                </td>
              </tr>
            )}

            {rooms.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.code || "-"}</td>
                <td className="p-3">{r.zone.name}</td>
                <td className="p-3">{r.location.siteName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===========================
         CREATE MODAL
      =========================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded p-6 space-y-4">
            <h2 className="text-lg font-semibold">Create Room</h2>

            <select
              className="w-full border rounded px-3 py-2"
              value={form.locationId}
              onChange={(e) =>
                setForm({
                  ...form,
                  locationId: e.target.value,
                  zoneId: "",
                })
              }
            >
              <option value="">Select Location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.siteName}
                </option>
              ))}
            </select>

            <select
              className="w-full border rounded px-3 py-2"
              value={form.zoneId}
              disabled={!form.locationId}
              onChange={(e) =>
                setForm({ ...form, zoneId: e.target.value })
              }
            >
              <option value="">Select Zone</option>
              {filteredZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Room name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Code (optional)"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={createRoom}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
