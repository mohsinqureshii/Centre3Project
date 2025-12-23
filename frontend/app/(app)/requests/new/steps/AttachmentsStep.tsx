'use client';

import React, { useMemo, useState } from 'react';
import type { WizardState } from '@/lib/centre3Types';

function requiredTypes(requestType: WizardState['requestType']): string[] {
  if (requestType === 'METHOD_OF_PROCEDURE') return ['MOP_DOC'];
  if (requestType === 'WORK_PERMIT') return ['WP_DOC'];
  return []; // MVP optional baseline
}

export function AttachmentsStep({
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
  const [touched, setTouched] = useState(false);
  const req = useMemo(() => requiredTypes(value.requestType), [value.requestType]);
  const missing = useMemo(() => {
    const have = new Set(value.attachments.map((a) => a.type));
    return req.filter((t) => !have.has(t));
  }, [req, value.attachments]);

  return (
    <div className="space-y-4">
      <div className="text-sm opacity-80">
        This step expects your existing upload flow. For now, paste Attachment IDs you already uploaded.
      </div>

      <div className="space-y-2">
        <div className="font-medium">Add attachment reference</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input className="border rounded-lg px-3 py-2" placeholder="Type e.g. MOP_DOC" id="attType" />
          <input className="border rounded-lg px-3 py-2" placeholder="Attachment ID" id="attId" />
          <button
            className="px-3 py-2 rounded-lg border"
            type="button"
            onClick={() => {
              const typeEl = document.getElementById('attType') as HTMLInputElement | null;
              const idEl = document.getElementById('attId') as HTMLInputElement | null;
              if (!typeEl || !idEl) return;
              const type = typeEl.value.trim();
              const attachmentId = idEl.value.trim();
              if (!type || !attachmentId) return;
              onChange({ ...value, attachments: [...value.attachments, { type, attachmentId }] });
              typeEl.value = '';
              idEl.value = '';
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Current attachments</div>
        <div className="space-y-2">
          {value.attachments.map((a, idx) => (
            <div key={`${a.type}-${idx}`} className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm">
              <div>
                <span className="font-semibold">{a.type}</span> — {a.attachmentId}
              </div>
              <button
                className="px-2 py-1 rounded border"
                onClick={() => onChange({ ...value, attachments: value.attachments.filter((_, i) => i !== idx) })}
              >
                Remove
              </button>
            </div>
          ))}
          {value.attachments.length === 0 && <div className="text-sm opacity-70">No attachments yet.</div>}
        </div>
      </div>

      {touched && missing.length > 0 && (
        <div className="p-3 rounded-lg border border-red-400/40 bg-red-500/10 text-sm">
          Missing required attachments: {missing.join(', ')}
        </div>
      )}

      <div className="flex justify-between">
        <button className="px-4 py-2 rounded-lg border" onClick={onPrev}>Back</button>
        <button
          className="px-4 py-2 rounded-lg border"
          onClick={() => {
            setTouched(true);
            if (missing.length === 0) onNext();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
