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
  code?: string;
  isLockable: boolean;
  location: {
    siteName: string;
  };
};

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    locationId: "",
    name: "",
    code: "",
    isLockable: true,
  });

  /* ===========================
     LOAD DATA (ONCE)
  =========================== */
  useEffect(() => {
    async function load() {
      try {
        const zonesRes = await api.get("/settings/zones");
        const locationsRes = await api.get("/settings/locations");

        // 🔒 FORCE ARRAY (NO GUESSING)
        const locationData: Location[] = Array.isArray(locationsRes.data)
          ? locationsRes.data
          : [];

        setZones(zonesRes.data || []);
        setLocations(locationData);
      } catch (err) {
        console.error("LOAD FAILED:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ===========================
     CREATE ZONE
  =========================== */
  async function createZone() {
    if (!form.locationId || !form.name) {
      alert("Location and Zone name required");
      return;
    }

    try {
      const res = await api.post("/settings/zones", form);
      setZones((prev) => [...prev, res.data]);
      setShowModal(false);
      setForm({
        locationId: "",
        name: "",
        code: "",
        isLockable: true,
      });
    } catch (err) {
      console.error("CREATE FAILED:", err);
    }
  }

  /* ===========================
     UI
  =========================== */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Zones</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Zone
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">Zone Name</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Lockable</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Loading zones...
                </td>
              </tr>
            )}

            {!loading && zones.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No zones found
                </td>
              </tr>
            )}

            {zones.map((z) => (
              <tr key={z.id} className="border-t">
                <td className="p-3">{z.name}</td>
                <td className="p-3">{z.code || "-"}</td>
                <td className="p-3">{z.location.siteName}</td>
                <td className="p-3">{z.isLockable ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===========================
         MODAL
      =========================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded p-6 space-y-4">
            <h2 className="font-semibold text-lg">Create Zone</h2>

            <select
              className="w-full border rounded px-3 py-2"
              value={form.locationId}
              onChange={(e) =>
                setForm({ ...form, locationId: e.target.value })
              }
            >
              <option value="">Select location</option>

              {locations.length === 0 && (
                <option disabled>No locations found</option>
              )}

              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.siteName}
                </option>
              ))}
            </select>

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Zone name"
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

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isLockable}
                onChange={(e) =>
                  setForm({ ...form, isLockable: e.target.checked })
                }
              />
              Lockable
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={createZone}
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
