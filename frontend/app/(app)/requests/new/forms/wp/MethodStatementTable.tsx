'use client';

import React from 'react';

export function MethodStatementTable({
  rows,
  onChange,
}: {
  rows: { description: string }[];
  onChange: (rows: { description: string }[]) => void;
}) {
  return (
    <div className="p-4 rounded-xl border space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Method Statement</div>
        <button className="px-3 py-1 rounded border" onClick={() => onChange([...rows, { description: '' }])}>Add Row</button>
      </div>
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={idx} className="flex gap-2">
            <div className="w-10 text-sm opacity-70 pt-2">{idx + 1}</div>
            <textarea className="flex-1 border rounded-lg px-3 py-2" value={r.description}
              onChange={(e) => {
                const next = rows.slice();
                next[idx] = { description: e.target.value };
                onChange(next);
              }}
            />
            <button className="px-3 py-2 rounded border" onClick={() => onChange(rows.filter((_, i) => i !== idx))}>Remove</button>
          </div>
        ))}
        {rows.length === 0 && <div className="text-sm opacity-70">At least 1 row required.</div>}
      </div>
    </div>
  );
}
