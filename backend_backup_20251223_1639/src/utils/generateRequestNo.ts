/**
 * Generates human-readable request numbers
 * Example: REQ-20251223-0001
 */

let counter = 0;

export function generateRequestNo(prefix: string) {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  counter += 1;
  const seq = String(counter).padStart(4, "0");

  return `${prefix}-${yyyy}${mm}${dd}-${seq}`;
}
