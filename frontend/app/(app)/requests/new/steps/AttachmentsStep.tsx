'use client';

import { useMemo } from 'react';
import type { WizardState, AttachmentType } from '@/lib/centre3Types';

function requiredTypes(
  requestType: WizardState['requestType']
): AttachmentType[] {
  if (requestType === 'METHOD_OF_PROCEDURE') return ['MOP_DOC'];
  if (requestType === 'WORK_PERMIT') return ['WP_DOC'];
  if (requestType === 'MATERIAL_VEHICLE_PERMIT') return ['MVP_DOC'];
  return [];
}

export function AttachmentsStep({
  value,
  onChange,
}: {
  value: WizardState;
  onChange: (s: WizardState) => void;
}) {
  const req = useMemo(
    () => requiredTypes(value.requestType),
    [value.requestType]
  );

  const missing = useMemo(() => {
    const have = new Set(value.attachments.map((a) => a.type));
    return req.filter((t) => !have.has(t));
  }, [req, value.attachments]);

  return (
    <div className="space-y-3">
      <div className="font-semibold">Attachments</div>

      {missing.length > 0 && (
        <div className="text-sm text-red-400">
          Missing required attachments:{' '}
          {missing.join(', ')}
        </div>
      )}

      {missing.length === 0 && (
        <div className="text-sm text-green-400">
          All required attachments uploaded.
        </div>
      )}
    </div>
  );
}
