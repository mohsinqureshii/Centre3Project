"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

interface Props {
  data: any;
  onBack: () => void;
  onNext: () => void;
  onChange: (data: any) => void;
}

export default function LocationStep({
  data,
  onBack,
  onNext,
  onChange,
}: Props) {
  const [locations, setLocations] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  // Load locations
  useEffect(() => {
    apiGet("/api/settings/locations").then(setLocations);
  }, []);

  // Load zones when location changes
  useEffect(() => {
    if (data.location?.id) {
      apiGet(`/api/settings/zones?locationId=${data.location.id}`).then(setZones);
      setRooms([]);
    }
  }, [data.location?.id]);

  // Load rooms when zone changes
  useEffect(() => {
    if (data.zone?.id) {
      apiGet(`/api/settings/rooms?zoneId=${data.zone.id}`).then(setRooms);
    }
  }, [data.zone?.id]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Step 2 — Location</h2>

      {/* LOCATION */}
<select
  className="w-full border p-2 mb-4 text-black bg-white"
  value={data.location?.id || ""}
  onChange={(e) => {
    const selected = locations.find(l => l.id === e.target.value);
    onChange({
      location: selected ? { id: selected.id, name: selected.siteName } : null,
      zone: null,
      room: null,
    });
  }}
>
  <option value="">Select Location</option>
  {locations.map((loc) => (
    <option key={loc.id} value={loc.id}>
      {loc.siteName}
    </option>
  ))}
</select>

      {/* ZONE */}
      <select
        className="w-full border p-2 mb-4 text-black bg-white"
        value={data.zone?.id || ""}
        disabled={!zones.length}
        onChange={(e) => {
          const selected = zones.find(z => z.id === e.target.value);
          onChange({
            zone: { id: selected.id, name: selected.name },
            room: null,
          });
        }}
      >
        <option value="">Select Zone</option>
        {zones.map((zone) => (
          <option key={zone.id} value={zone.id}>
            {zone.name}
          </option>
        ))}
      </select>

      {/* ROOM */}
      <select
        className="w-full border p-2 mb-6 text-black bg-white"
        value={data.room?.id || ""}
        disabled={!rooms.length}
        onChange={(e) => {
          const selected = rooms.find(r => r.id === e.target.value);
          onChange({
            room: { id: selected.id, name: selected.name },
          });
        }}
      >
        <option value="">Select Room</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button onClick={onBack} className="px-4 py-2 border">
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-black text-white"
          disabled={!data.room}
        >
          Next
        </button>
      </div>
    </div>
  );
}
