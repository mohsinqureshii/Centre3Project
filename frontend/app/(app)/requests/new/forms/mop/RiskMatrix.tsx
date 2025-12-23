'use client';

import React, { useMemo } from 'react';
import type { MOPRiskMatrix } from '@/lib/centre3Types';

function levelFromScore(score: number): MOPRiskMatrix['level'] {
  if (score <= 4) return 'LOW';
  if (score <= 9) return 'MEDIUM';
  if (score <= 16) return 'HIGH';
  return 'CRITICAL';
}

export function RiskMatrix({ value, onChange }: { value: MOPRiskMatrix; onChange: (v: MOPRiskMatrix) => void }) {
  const score = value.likelihood * value.severity;
  const level = levelFromScore(score);

  const needsMitigation = level === 'HIGH' || level === 'CRITICAL';

  const next = useMemo(() => ({ ...value, score, level }), [value, score, level]);
  if (value.score !== score || value.level !== level) onChange(next);

  return (
    <div className="p-4 rounded-xl border space-y-3">
      <div className="font-semibold">Risk Assessment Matrix</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="space-y-1">
          <div className="text-sm">Likelihood (1–5)</div>
          <select className="w-full border rounded-lg px-3 py-2" value={value.likelihood}
            onChange={(e) => onChange({ ...value, likelihood: Number(e.target.value) as any })}
          >
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="space-y-1">
          <div className="text-sm">Severity (1–5)</div>
          <select className="w-full border rounded-lg px-3 py-2" value={value.severity}
            onChange={(e) => onChange({ ...value, severity: Number(e.target.value) as any })}
          >
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <div className="p-3 rounded-lg border">
          <div className="text-sm opacity-70">Score</div>
          <div className="text-2xl font-semibold">{score}</div>
          <div className="text-sm">Level: <span className="font-semibold">{level}</span></div>
        </div>
      </div>

      <label className="space-y-1">
        <div className="text-sm">Mitigation Plan {needsMitigation ? '(required)' : '(optional)'}</div>
        <textarea className="w-full border rounded-lg px-3 py-2" value={value.mitigation || ''}
          onChange={(e) => onChange({ ...value, mitigation: e.target.value })}
        />
      </label>

      {needsMitigation && !value.mitigation?.trim() && (
        <div className="p-3 rounded-lg border border-red-400/40 bg-red-500/10 text-sm">
          Mitigation is required for HIGH/CRITICAL risk.
        </div>
      )}
    </div>
  );
}
