// Oversættelse fra MotorAPI's rå felter til de felter, bilkortet viser.
//
// STATUS: UVERIFICERET. Feltnavnene i MotorAPI's køretøjssvar er ikke
// dokumenterede, og der ligger endnu ingen samples/*.json at udlede dem fra.
//
// Derfor slår hver visningsværdi op i en liste af kandidat-navne og bruger den
// første, der findes i svaret. Det er ikke elegant, men det er ærligt: koden
// påstår ikke at kende feltnavnene, og opslaget falder blødt tilbage til
// "ukendt" i stedet for at vise tom luft, hvis ingen kandidat rammer.
//
// NÅR SAMPLES ANKOMMER
//   1. Kør `npm run motorapi:fields -- samples/vehicle.json` for at se, hvilke
//      nøgler der faktisk findes i svaret.
//   2. Erstat kandidatlisterne herunder med det ene rigtige feltnavn.
//   3. Stram VehicleSchema i schemas.ts til de rigtige felter.
//   4. Ret VERIFICERET-noten i README.

/** Felter bilkortet viser, i den rækkefølge de vises. */
export interface VehicleSummary {
  brand?: string;
  model?: string;
  variant?: string;
  year?: number;
  fuel?: string;
  colour?: string;
  /** Alt vi fik fra API'et, så intet går tabt undervejs. */
  raw: Record<string, unknown>;
}

/**
 * Kandidat-navne pr. visningsfelt. Dansk først, da MotorAPI er et dansk API
 * bygget på Motorregistrets termer, derefter almindelige engelske varianter.
 */
const CANDIDATES: Record<
  Exclude<keyof VehicleSummary, "raw">,
  readonly string[]
> = {
  brand: ["maerke", "mærke", "brand", "make", "manufacturer"],
  model: ["model", "modelNavn", "model_name"],
  variant: ["variant", "version", "type", "modelVariant", "model_variant"],
  year: [
    "aargang",
    "årgang",
    "modelaar",
    "modelår",
    "year",
    "model_year",
    "first_registration_year",
  ],
  fuel: ["braendstof", "brændstof", "fuel", "fuel_type", "drivkraft"],
  colour: ["farve", "colour", "color"],
};

/** Slå et felt op på tværs af kandidatnavne, uanset store/små bogstaver. */
function pick(source: Record<string, unknown>, keys: readonly string[]) {
  const lowered = new Map(
    Object.entries(source).map(([k, v]) => [k.toLowerCase(), v]),
  );
  for (const key of keys) {
    const value = lowered.get(key.toLowerCase());
    if (value !== null && value !== undefined && value !== "") return value;
  }
  return undefined;
}

function asText(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number") return String(value);
  return undefined;
}

function asYear(value: unknown): number | undefined {
  const text = asText(value);
  if (!text) return undefined;
  // Fanger både "2017" og datoformater som "2017-04-12".
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : undefined;
}

/**
 * Reducér et rå køretøjssvar til det, kortet viser. Ukendte felter bevares i
 * `raw`, så de skjulte formularfelter kan sende alt med videre.
 */
export function toVehicleSummary(raw: unknown): VehicleSummary {
  if (typeof raw !== "object" || raw === null) return { raw: {} };
  const source = raw as Record<string, unknown>;

  // Nogle API'er lægger køretøjet i en indpakning. Findes en oplagt sådan
  // nøgle, læses felterne derfra i stedet.
  const inner =
    (source.vehicle as Record<string, unknown> | undefined) ??
    (source.data as Record<string, unknown> | undefined) ??
    source;
  const fields = typeof inner === "object" && inner !== null ? inner : source;

  return {
    brand: asText(pick(fields, CANDIDATES.brand)),
    model: asText(pick(fields, CANDIDATES.model)),
    variant: asText(pick(fields, CANDIDATES.variant)),
    year: asYear(pick(fields, CANDIDATES.year)),
    fuel: asText(pick(fields, CANDIDATES.fuel)),
    colour: asText(pick(fields, CANDIDATES.colour)),
    raw: source,
  };
}

/** Sandt hvis vi fandt nok til at kortet siger noget meningsfuldt. */
export function hasUsableSummary(summary: VehicleSummary): boolean {
  return Boolean(summary.brand || summary.model || summary.year);
}
