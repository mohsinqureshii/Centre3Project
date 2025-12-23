"use client";

import { useEffect, useState } from "react";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

type Location = {
  id: string;
  country: string;
  city: string;
  siteName: string;
};

type Zone = {
  id: string;
  name: string;
};

type Room = {
  id: string;
  name: string;
};

export default function SiteInfoStep({ onNext, onBack }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [locationId, setLocationId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [roomId, setRoomId] = useState("");

  /* ---------------- Fetch Locations ---------------- */
  useEffect(() => {
    fetch("/api/settings/locations", {
      headers: { Authorization: "Bearer REAL_TOKEN" },
    })
      .then((r) => r.json())
      .then(setLocations);
  }, []);

  /* ---------------- Fetch Zones ---------------- */
  useEffect(() => {
    if (!locationId) return;
    setZoneId("");
    setRoomId("");
    setRooms([]);

    fetch(`/api/settings/zones?locationId=${locationId}`, {
      headers: { Authorization: "Bearer REAL_TOKEN" },
    })
      .then((r) => r.json())
      .then(setZones);
  }, [locationId]);

  /* ---------------- Fetch Rooms ---------------- */
  useEffect(() => {
    if (!zoneId) return;
    setRoomId("");

    fetch(`/api/settings/rooms?zoneId=${zoneId}`, {
      headers: { Authorization: "Bearer REAL_TOKEN" },
    })
      .then((r) => r.json())
      .then(setRooms);
  }, [zoneId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Location & Access Area</h2>

      {/* Location */}
      <div>
        <label className="block text-sm mb-1">Site Location</label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">Select Location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.country} — {l.city} — {l.siteName}
            </option>
          ))}
        </select>
      </div>

      {/* Zone */}
      <div>
        <label className="block text-sm mb-1">Zone</label>
        <select
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
          className="w-full rounded border p-2"
          disabled={!locationId}
        >
          <option value="">Select Zone</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>

      {/* Room */}
      <div>
        <label className="block text-sm mb-1">Room</label>
        <select
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full rounded border p-2"
          disabled={!zoneId}
        >
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="rounded border px-4 py-2"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!locationId}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
