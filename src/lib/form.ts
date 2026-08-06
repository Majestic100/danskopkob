// Delte formular-helpers (bruges af både LeadForm og salgsformularen).

// Plade-logikken ligger i lib/plate.ts, fordi serverlaget bruger den samme.
// To sæt regler ville før eller siden komme ud af trit, og så ville browseren
// sende opslag af sted, som serveren afviser (eller omvendt).
import { normalizePlate } from "./plate";

export { isValidPlate } from "./plate";

/** Til visning i inputfeltet: normaliseret og skåret til pladens 7 tegn. */
export function formatPlate(v: string) {
  return normalizePlate(v).slice(0, 7);
}

export function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Dansk mobil/fastnet: 8 cifre, evt. med +45/0045 foran.
export function isValidPhone(v: string) {
  const digits = v.replace(/\D/g, "");
  return (
    digits.length === 8 ||
    (digits.length === 10 && digits.startsWith("45")) ||
    (digits.length === 12 && digits.startsWith("0045"))
  );
}
