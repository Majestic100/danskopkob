// Delte formular-helpers (bruges af både LeadForm og salgsformularen).

export function formatPlate(v: string) {
  return v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}

export function isValidPlate(v: string) {
  return /^[A-Z]{2}[0-9]{4,5}$/.test(v.replace(/\s/g, "").toUpperCase());
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
