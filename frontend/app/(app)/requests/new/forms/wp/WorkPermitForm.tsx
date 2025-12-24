'use client';

import React from 'react';
import type { WizardState, WPRisk } from '@/lib/centre3Types';
import { RiskListTable } from './RiskListTable';

export function WorkPermitForm({
  value,
  onChange,
}: {
  value: WizardState;
  onChange: (s: WizardState) => void;
}) {
  const wp = value.wp || {
    cabinets: '',
    methodStatements: [{ description: '' }],
    risks: [{ description: '', impact: 'Minor', control: '' }],
  };

  return (
    <div className="space-y-4">
      <label className="space-y-1">
        <div className="text-sm">Cabinets / Equipment</div>
        <input
          className="w-full border rounded-lg px-3 py-2"
          value={wp.cabinets}
          onChange={(e) =>
            onChange({ ...value, wp: { ...wp, cabinets: e.target.value } })
          }
        />
      </label>

      <RiskListTable
        rows={wp.risks as any}
        onChange={(rows) =>
          onChange({
            ...value,
            wp: {
              ...wp,
              risks: rows as WPRisk[],
            },
          })
        }
      />
    </div>
  );
}
