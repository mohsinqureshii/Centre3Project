'use client';

import React from 'react';
import type { WizardState } from '@/lib/centre3Types';
import { MethodStatementTable } from './MethodStatementTable';
import { RiskListTable } from './RiskListTable';

export function WorkPermitForm({ value, onChange }: { value: WizardState; onChange: (s: WizardState) => void }) {
  const wp = value.wp || { cabinets: '', methodStatements: [{ description: '' }], risks: [{ description: '', impact: 'Minor', control: '' }] };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <div className="text-sm">Cabinets / Rack</div>
          <input className="w-full border rounded-lg px-3 py-2" value={wp.cabinets}
            onChange={(e) => onChange({ ...value, wp: { ...wp, cabinets: e.target.value } })} />
        </label>
      </div>

      <MethodStatementTable
        rows={wp.methodStatements}
        onChange={(rows) => onChange({ ...value, wp: { ...wp, methodStatements: rows } })}
      />

      <RiskListTable
        rows={wp.risks}
        onChange={(rows) => onChange({ ...value, wp: { ...wp, risks: rows } })}
      />
    </div>
  );
}
