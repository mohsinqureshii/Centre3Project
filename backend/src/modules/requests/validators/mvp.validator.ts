import { ValidationError, assertMaxDays } from './common.js';

export function validateMvp(input: any, startAt: any, endAt: any) {
  const errs: string[] = [];
  assertMaxDays(startAt, endAt, 14, 'Material & Vehicle Permit');
  if (!input) errs.push('MVP formData is required');
  const mats = input?.materials || [];
  if (!Array.isArray(mats) || mats.length < 1) errs.push('MVP: materials must have at least 1 row');
  if (input?.decisionType === 'WITH_VEHICLE') {
    const v = input?.vehicle;
    if (!v?.driverName || !v?.driverId || !v?.plate) errs.push('MVP: vehicle details required for WITH_VEHICLE');
  }
  if (errs.length) throw new ValidationError('MVP validation failed', errs);
}
