// Nummerplade- og VIN-håndtering, delt mellem browseren og serverlaget.
//
// Formålet med at dele koden: browseren skal afvise åbenlyst ugyldigt input,
// før der overhovedet sendes en request, og serveren skal afvise det samme
// igen, fordi den ikke kan stole på klienten. Hvert kald til MotorAPI koster
// af dagskvoten, så et opslag på "AB1" må aldrig nå ud af huset.

/**
 * Gør input klar til udgående kald: trim, uppercase, og fjern alt der ikke er
 * bogstaver eller tal (mellemrum, bindestreger, punktummer).
 */
export function normalizePlate(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * Danske nummerplader: to bogstaver efterfulgt af 4-5 cifre (fx AB12345).
 * Dækker almindelige person- og varebilsplader.
 */
const PLATE_PATTERN = /^[A-Z]{2}[0-9]{4,5}$/;

/**
 * VIN: 17 tegn uden I, O og Q, som er udeladt i standarden for ikke at kunne
 * forveksles med 1 og 0.
 */
const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export function isValidPlate(input: string): boolean {
  return PLATE_PATTERN.test(normalizePlate(input));
}

export function isValidVin(input: string): boolean {
  return VIN_PATTERN.test(normalizePlate(input));
}

/** Sandt hvis input kan slås op hos MotorAPI, som tager både plade og VIN. */
export function isLookupable(input: string): boolean {
  return isValidPlate(input) || isValidVin(input);
}

/**
 * Vises i inputfeltet mens der tastes: "AB 12 345". Grupperingen er kun
 * kosmetisk, og normalizePlate fjerner den igen inden afsendelse.
 */
export function formatPlateForDisplay(input: string): string {
  const raw = normalizePlate(input).slice(0, 7);
  const letters = raw.slice(0, 2);
  const digits = raw.slice(2);
  if (!digits) return letters;
  if (digits.length <= 2) return `${letters} ${digits}`;
  return `${letters} ${digits.slice(0, 2)} ${digits.slice(2)}`;
}
