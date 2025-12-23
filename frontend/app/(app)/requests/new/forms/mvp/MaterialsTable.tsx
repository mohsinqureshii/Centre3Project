'use client';

import React from 'react';

export function MaterialsTable({
  rows,
  onChange,
}: {
  rows: { description: string; quantity: number; reason: string; partNumber?: string; serialNo?: string }[];
  onChange: (rows: { description: string; quantity: number; reason: string; partNumber?: string; serialNo?: string }[]) => void;
}) {
  return (
    <div className="p-4 rounded-xl border space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Materials</div>
        <button className="px-3 py-1 rounded border" onClick={() => onChange([...rows, { description: '', quantity: 1, reason: '' }])}>Add Row</button>
      </div>
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
            <div className="md:col-span-1 text-sm opacity-70 pt-2">{idx + 1}</div>
            <input className="md:col-span-4 border rounded-lg px-3 py-2" placeholder="Description" value={r.description}
              onChange={(e) => {
                const next = rows.slice();
                next[idx] = { ...r, description: e.target.value };
                onChange(next);
              }}
            />
            <input className="md:col-span-2 border rounded-lg px-3 py-2" placeholder="Qty" type="number" value={r.quantity}
              onChange={(e) => {
                const next = rows.slice();
                next[idx] = { ...r, quantity: Number(e.target.value) };
                onChange(next);
              }}
            />
            <input className="md:col-span-4 border rounded-lg px-3 py-2" placeholder="Reason" value={r.reason}
              onChange={(e) => {
                const next = rows.slice();
                next[idx] = { ...r, reason: e.target.value };
                onChange(next);
              }}
            />
            <button className="md:col-span-1 px-3 py-2 rounded border" onClick={() => onChange(rows.filter((_, i) => i !== idx))}>X</button>
          </div>
        ))}
        {rows.length === 0 && <div className="text-sm opacity-70">At least 1 material is required.</div>}
      </div>
    </div>
  );
}
