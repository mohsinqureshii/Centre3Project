'use client';

import React from 'react';
import type { WizardState } from '@/lib/centre3Types';
import { WorkPermitForm } from '../forms/wp/WorkPermitForm';
import { MopWizard } from '../forms/mop/MopWizard';
import { MaterialVehiclePermitForm } from '../forms/mvp/MaterialVehiclePermitForm';

export function DetailsStep({
  value,
  onChange,
  onPrev,
  onNext,
}: {
  value: WizardState;
  onChange: (s: WizardState) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      {value.requestType === 'WORK_PERMIT' && (
        <WorkPermitForm value={value} onChange={onChange} />
      )}
      {value.requestType === 'METHOD_OF_PROCEDURE' && (
        <MopWizard value={value} onChange={onChange} />
      )}
      {value.requestType === 'MATERIAL_VEHICLE_PERMIT' && (
        <MaterialVehiclePermitForm value={value} onChange={onChange} />
      )}

      <div className="flex justify-between">
        <button className="px-4 py-2 rounded-lg border" onClick={onPrev}>Back</button>
        <button className="px-4 py-2 rounded-lg border" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
