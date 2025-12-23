'use client';

import React from 'react';

type Impact = 'None' | 'Minor' | 'Significant' | 'Major';

export function RiskListTable({
  rows,
  onChange,
}: {
  rows: { description: string; impact: Impact; control: string }[];
  onChange: (rows: { description: string; impact: Impact; control: string }[]) => void;
}) {
  return (
    <div className="p-4 rounded-xl border space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Risk List</div>
        <button className="px-3 py-1 rounded border" onClick={() => onChange([...rows, { description: '', impact: 'Minor', control: '' }])}>Add Row</button>
      </div>
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
            <div className="md:col-span-1 text-sm opacity-70 pt-2">{idx + 1}</div>
            <textarea className="md:col-span-5 border rounded-lg px-3 py-2" placeholder="Risk description" value={r.description}
              onChange={(e) => {
                const next = rows.slice();
                next[idx] = { ...r, description: e.target.value };
                onChange(next);
              }}
            />
            <select className="md:col-span-2 border rounded-lg px-3 py-2" value={r.impact}
              onChange={(e) => {
                const next = rows.slice();
                next[idx] = { ...r, impact: e.target.value as Impact };
                onChange(next);
              }}
            >
              {['None','Minor','Significant','Major'].map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <textarea className="md:col-span-3 border rounded-lg px-3 py-2" placeholder="Control" value={r.control}
              onChange={(e) => {
                const next = rows.slice();
                next[idx] = { ...r, control: e.target.value };
                onChange(next);
              }}
            />
            <button className="md:col-span-1 px-3 py-2 rounded border" onClick={() => onChange(rows.filter((_, i) => i !== idx))}>X</button>
          </div>
        ))}
        {rows.length === 0 && <div className="text-sm opacity-70">At least 1 row required.</div>}
      </div>
    </div>
  );
}
