'use client';

import React, { useMemo, useState } from 'react';
import type { WizardState, MOPRiskMatrix, MOPFormData } from '@/lib/centre3Types';
import { RiskMatrix } from './RiskMatrix';

function defaultRisk(): MOPRiskMatrix {
  return { likelihood: 1, severity: 1, score: 1, level: 'LOW' };
}

function computeLevel(score: number): MOPRiskMatrix['level'] {
  if (score <= 4) return 'LOW';
  if (score <= 9) return 'MEDIUM';
  if (score <= 16) return 'HIGH';
  return 'CRITICAL';
}

export function MopWizard({ value, onChange }: { value: WizardState; onChange: (s: WizardState) => void }) {
  const mop: MOPFormData = value.mop || {
    projectInfo: { projectName: '', projectNumber: '', projectOwner: '', mainService: '', projectStatus: 'New Project' },
    contractor: { companyName: '', contactPerson: '', mobileNumber: '', email: '', lineManager: '' },
    readinessChecklist: [{ task: '', assignee: '', status: 'Pending' }],
    implementationSteps: [{ step: '', owner: '' }],
    rollbackPlans: [{ scenario: '', action: '' }],
    participants: [{ name: '', company: '', designation: '' }],
    riskMatrix: defaultRisk(),
  };

  const [tab, setTab] = useState<'INFO'|'READINESS'|'STEPS'|'ROLLBACK'|'PARTICIPANTS'|'RISK'>('INFO');
  const score = mop.riskMatrix.likelihood * mop.riskMatrix.severity;
  const level = computeLevel(score);

  const risk: MOPRiskMatrix = useMemo(() => ({
    ...mop.riskMatrix,
    score,
    level,
  }), [mop.riskMatrix, score, level]);

  // keep derived values in state
  if (mop.riskMatrix.score !== score || mop.riskMatrix.level !== level) {
    const next = { ...mop, riskMatrix: risk };
    onChange({ ...value, mop: next });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {[
          ['INFO','Project & Contractor'],
          ['READINESS','Readiness'],
          ['STEPS','Implementation'],
          ['ROLLBACK','Rollback'],
          ['PARTICIPANTS','Participants'],
          ['RISK','Risk Matrix'],
        ].map(([k, label]) => (
          <button key={k} className={`px-3 py-2 rounded-lg border text-sm ${tab === k ? 'bg-white/10' : ''}`} onClick={() => setTab(k as any)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'INFO' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <div className="text-sm">Project Name</div>
            <input className="w-full border rounded-lg px-3 py-2" value={mop.projectInfo.projectName}
              onChange={(e) => onChange({ ...value, mop: { ...mop, projectInfo: { ...mop.projectInfo, projectName: e.target.value } } })} />
          </label>
          <label className="space-y-1">
            <div className="text-sm">Project Number</div>
            <input className="w-full border rounded-lg px-3 py-2" value={mop.projectInfo.projectNumber}
              onChange={(e) => onChange({ ...value, mop: { ...mop, projectInfo: { ...mop.projectInfo, projectNumber: e.target.value } } })} />
          </label>
          <label className="space-y-1">
            <div className="text-sm">Contractor Company</div>
            <input className="w-full border rounded-lg px-3 py-2" value={mop.contractor.companyName}
              onChange={(e) => onChange({ ...value, mop: { ...mop, contractor: { ...mop.contractor, companyName: e.target.value } } })} />
          </label>
          <label className="space-y-1">
            <div className="text-sm">Contractor Email</div>
            <input className="w-full border rounded-lg px-3 py-2" value={mop.contractor.email}
              onChange={(e) => onChange({ ...value, mop: { ...mop, contractor: { ...mop.contractor, email: e.target.value } } })} />
          </label>
        </div>
      )}

      {tab === 'READINESS' && (
        <MultiRowSimple
          title="Readiness Checklist"
          rows={mop.readinessChecklist}
          columns={[
            { key: 'task', label: 'Task' },
            { key: 'assignee', label: 'Assignee' },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending','Done'] },
          ]}
          onChange={(rows) => onChange({ ...value, mop: { ...mop, readinessChecklist: rows as any } })}
          onAdd={() => onChange({ ...value, mop: { ...mop, readinessChecklist: [...mop.readinessChecklist, { task: '', assignee: '', status: 'Pending' }] } })}
        />
      )}

      {tab === 'STEPS' && (
        <MultiRowSimple
          title="Implementation Steps"
          rows={mop.implementationSteps}
          columns={[
            { key: 'step', label: 'Step' },
            { key: 'owner', label: 'Owner' },
          ]}
          onChange={(rows) => onChange({ ...value, mop: { ...mop, implementationSteps: rows as any } })}
          onAdd={() => onChange({ ...value, mop: { ...mop, implementationSteps: [...mop.implementationSteps, { step: '', owner: '' }] } })}
        />
      )}

      {tab === 'ROLLBACK' && (
        <MultiRowSimple
          title="Failure Scenarios & Rollback"
          rows={mop.rollbackPlans}
          columns={[
            { key: 'scenario', label: 'Scenario' },
            { key: 'action', label: 'Rollback Action' },
          ]}
          onChange={(rows) => onChange({ ...value, mop: { ...mop, rollbackPlans: rows as any } })}
          onAdd={() => onChange({ ...value, mop: { ...mop, rollbackPlans: [...mop.rollbackPlans, { scenario: '', action: '' }] } })}
        />
      )}

      {tab === 'PARTICIPANTS' && (
        <MultiRowSimple
          title="Participants"
          rows={mop.participants}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'company', label: 'Company' },
            { key: 'designation', label: 'Designation' },
            { key: 'contact', label: 'Contact (optional)' },
          ]}
          onChange={(rows) => onChange({ ...value, mop: { ...mop, participants: rows as any } })}
          onAdd={() => onChange({ ...value, mop: { ...mop, participants: [...mop.participants, { name: '', company: '', designation: '' }] } })}
        />
      )}

      {tab === 'RISK' && (
        <RiskMatrix
          value={risk}
          onChange={(rm) => onChange({ ...value, mop: { ...mop, riskMatrix: rm } })}
        />
      )}
    </div>
  );
}

function MultiRowSimple({
  title,
  rows,
  columns,
  onChange,
  onAdd,
}: {
  title: string;
  rows: any[];
  columns: { key: string; label: string; type?: 'select'; options?: string[] }[];
  onChange: (rows: any[]) => void;
  onAdd: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{title}</div>
        <button className="px-3 py-1 rounded border" onClick={onAdd}>Add Row</button>
      </div>
      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
            <div className="md:col-span-1 text-sm opacity-70 pt-2">{idx + 1}</div>
            {columns.map((c) => (
              <div key={c.key} className="md:col-span-3">
                {c.type === 'select' ? (
                  <select className="w-full border rounded-lg px-3 py-2" value={r[c.key] || ''}
                    onChange={(e) => {
                      const next = rows.slice();
                      next[idx] = { ...r, [c.key]: e.target.value };
                      onChange(next);
                    }}
                  >
                    {(c.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className="w-full border rounded-lg px-3 py-2" placeholder={c.label} value={r[c.key] || ''}
                    onChange={(e) => {
                      const next = rows.slice();
                      next[idx] = { ...r, [c.key]: e.target.value };
                      onChange(next);
                    }}
                  />
                )}
              </div>
            ))}
            <button className="md:col-span-2 px-3 py-2 rounded border" onClick={() => onChange(rows.filter((_, i) => i !== idx))}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
