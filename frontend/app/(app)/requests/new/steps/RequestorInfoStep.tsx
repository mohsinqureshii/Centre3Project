'use client';

import React, { useMemo, useState } from 'react';
import type { WizardState } from '@/lib/centre3Types';

function validate(v: WizardState) {
  const errs: string[] = [];
  if (!v.requestor.fullName.trim()) errs.push('Full name is required');
  if (!v.requestor.email.trim()) errs.push('Email is required');
  if (!v.requestor.phone.trim()) errs.push('Phone is required');
  if (!v.requestor.company.trim()) errs.push('Company is required');
  return errs;
}

export function RequestorInfoStep({
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
  const errs = useMemo(() => (touched ? validate(value) : []), [touched, value]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <div className="text-sm">Full Name</div>
          <input className="w-full border rounded-lg px-3 py-2" value={value.requestor.fullName}
            onChange={(e) => onChange({ ...value, requestor: { ...value.requestor, fullName: e.target.value } })} />
        </label>
        <label className="space-y-1">
          <div className="text-sm">Email</div>
          <input className="w-full border rounded-lg px-3 py-2" value={value.requestor.email}
            onChange={(e) => onChange({ ...value, requestor: { ...value.requestor, email: e.target.value } })} />
        </label>
        <label className="space-y-1">
          <div className="text-sm">Phone</div>
          <input className="w-full border rounded-lg px-3 py-2" value={value.requestor.phone}
            onChange={(e) => onChange({ ...value, requestor: { ...value.requestor, phone: e.target.value } })} />
        </label>
        <label className="space-y-1">
          <div className="text-sm">Company</div>
          <input className="w-full border rounded-lg px-3 py-2" value={value.requestor.company}
            onChange={(e) => onChange({ ...value, requestor: { ...value.requestor, company: e.target.value } })} />
        </label>
      </div>

      {errs.length > 0 && (
        <div className="p-3 rounded-lg border border-red-400/40 bg-red-500/10 text-sm">
          <ul className="list-disc ml-5">
            {errs.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="flex justify-between">
        <button className="px-4 py-2 rounded-lg border" onClick={onPrev}>Back</button>
        <button
          className="px-4 py-2 rounded-lg border"
          onClick={() => {
            setTouched(true);
            const e = validate(value);
            if (e.length === 0) onNext();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
