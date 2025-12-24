import { ValidationError, assertMaxDays } from './common.js';

export function validateWorkPermit(input: any, startAt: any, endAt: any) {
  const errs: string[] = [];
  assertMaxDays(startAt, endAt, 14, 'Work Permit');
  if (!input) errs.push('WP formData is required');
  const ms = input?.methodStatements || [];
  const risks = input?.risks || [];
  if (!Array.isArray(ms) || ms.length < 1) errs.push('Work Permit: Method Statement must have at least 1 row');
  if (!Array.isArray(risks) || risks.length < 1) errs.push('Work Permit: Risk List must have at least 1 row');
  if (errs.length) throw new ValidationError('Work Permit validation failed', errs);
}
