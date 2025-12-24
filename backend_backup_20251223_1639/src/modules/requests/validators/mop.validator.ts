import { ValidationError, assertMaxDays } from './common.js';

function riskLevel(score: number): 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL' {
  if (score <= 4) return 'LOW';
  if (score <= 9) return 'MEDIUM';
  if (score <= 16) return 'HIGH';
  return 'CRITICAL';
}

export function validateMop(input: any, startAt: any, endAt: any) {
  const errs: string[] = [];
  assertMaxDays(startAt, endAt, 14, 'Method of Procedure');
  if (!input) errs.push('MOP formData is required');
  const rm = input?.riskMatrix;
  if (!rm) errs.push('MOP: riskMatrix is required');
  const likelihood = Number(rm?.likelihood);
  const severity = Number(rm?.severity);
  if (!(likelihood >= 1 && likelihood <= 5)) errs.push('MOP: likelihood must be 1..5');
  if (!(severity >= 1 && severity <= 5)) errs.push('MOP: severity must be 1..5');
  const score = likelihood * severity;
  const lvl = riskLevel(score);
  if ((lvl === 'HIGH' || lvl === 'CRITICAL') && !String(rm?.mitigation || '').trim()) {
    errs.push('MOP: mitigation is required for HIGH/CRITICAL risk');
  }
  const readiness = input?.readinessChecklist || [];
  const steps = input?.implementationSteps || [];
  if (!Array.isArray(readiness) || readiness.length < 1) errs.push('MOP: readinessChecklist must have at least 1 row');
  if (!Array.isArray(steps) || steps.length < 1) errs.push('MOP: implementationSteps must have at least 1 row');
  if (errs.length) throw new ValidationError('MOP validation failed', errs);
}
