'use client';

import React from 'react';

export function VehicleDetails({
  value,
  onChange,
}: {
  value?: { driverName: string; driverId: string; plate: string; vehicleType: string };
  onChange: (v: { driverName: string; driverId: string; plate: string; vehicleType: string }) => void;
}) {
  const v = value || { driverName: '', driverId: '', plate: '', vehicleType: '' };

  return (
    <div className="p-4 rounded-xl border space-y-3">
      <div className="font-semibold">Vehicle Details</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {([
          ['driverName','Driver Name'],
          ['driverId','Driver ID'],
          ['plate','Plate Number'],
          ['vehicleType','Vehicle Type'],
        ] as const).map(([key, label]) => (
          <label key={key} className="space-y-1">
            <div className="text-sm">{label}</div>
            <input className="w-full border rounded-lg px-3 py-2" value={(v as any)[key]}
              onChange={(e) => onChange({ ...v, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
