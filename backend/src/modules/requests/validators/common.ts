export class ValidationError extends Error {
  statusCode = 400;
  details: string[];
  constructor(message: string, details: string[]) {
    super(message);
    this.details = details;
  }
}

export function assertMaxDays(startAt: string | Date, endAt: string | Date, maxDays: number, label: string) {
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();
  if (!(e > s)) throw new ValidationError('Invalid schedule', [`${label}: endAt must be after startAt`]);
  const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  if (days > maxDays) throw new ValidationError('Invalid schedule', [`${label}: duration must be <= ${maxDays} days`]);
}
