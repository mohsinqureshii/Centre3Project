'use client';

import React from 'react';
import type { WizardState, MVPFormData } from '@/lib/centre3Types';
import { MaterialsTable } from './MaterialsTable';
import { VehicleDetails } from './VehicleDetails';

export function MaterialVehiclePermitForm({ value, onChange }: { value: WizardState; onChange: (s: WizardState) => void }) {
  const mvp: MVPFormData = value.mvp || {
    decisionType: 'WITHOUT_VEHICLE',
    movementType: 'ENTRY',
    responsible: { name: '', company: '', mobile: '', email: '', idNumber: '' },
    materials: [{ description: '', quantity: 1, reason: '' }],
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <div className="text-sm">Decision Type</div>
          <select className="w-full border rounded-lg px-3 py-2" value={mvp.decisionType}
            onChange={(e) => onChange({ ...value, mvp: { ...mvp, decisionType: e.target.value as any } })}
          >
            <option value="WITH_VEHICLE">With Vehicle</option>
            <option value="WITHOUT_VEHICLE">Without Vehicle</option>
          </select>
        </label>
        <label className="space-y-1">
          <div className="text-sm">Movement Type</div>
          <select className="w-full border rounded-lg px-3 py-2" value={mvp.movementType}
            onChange={(e) => onChange({ ...value, mvp: { ...mvp, movementType: e.target.value as any } })}
          >
            <option value="ENTRY">Entry</option>
            <option value="EXIT">Exit</option>
            <option value="BOTH">Entry & Exit</option>
          </select>
        </label>
      </div>

      <div className="p-4 rounded-xl border space-y-3">
        <div className="font-semibold">Responsible Person</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {([
            ['name','Name'],
            ['company','Company'],
            ['mobile','Mobile'],
            ['email','Email'],
            ['idNumber','ID Number'],
          ] as const).map(([key, label]) => (
            <label key={key} className="space-y-1">
              <div className="text-sm">{label}</div>
              <input className="w-full border rounded-lg px-3 py-2" value={(mvp.responsible as any)[key] || ''}
                onChange={(e) => onChange({ ...value, mvp: { ...mvp, responsible: { ...mvp.responsible, [key]: e.target.value } } })}
              />
            </label>
          ))}
        </div>
      </div>

      {mvp.decisionType === 'WITH_VEHICLE' && (
        <VehicleDetails value={mvp.vehicle} onChange={(veh) => onChange({ ...value, mvp: { ...mvp, vehicle: veh } })} />
      )}

      <MaterialsTable
        rows={mvp.materials}
        onChange={(rows) => onChange({ ...value, mvp: { ...mvp, materials: rows } })}
      />
    </div>
  );
}
