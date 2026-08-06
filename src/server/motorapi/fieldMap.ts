// Oversættelse fra MotorAPI's rå felter til det, bilkortet viser.
//
// STATUS: VERIFICERET mod et rigtigt svar fra GET /vehicles/{reg-nr},
// hentet 2026-08-06. Feltnavnene herunder er de faktiske, ikke gæt.
//
// Data kommer fra Motorregistret, og registerdata er ujævne. To fælder, som
// det rigtige svar afslørede, og som resten af filen er bygget op om:
//
//   model_year kan være 0. Ikke null, ikke fraværende — nul. Årgangen udledes
//   derfor primært af first_registration, som er datoen bilen kom på vejen.
//   model_year bruges kun som reserve, og kun hvis værdien er troværdig.
//
//   Tekstfelter kan indeholde "Ukendt" eller tom streng i stedet for null.
//   Uden filtrering ville kortet skrive "Ukendt" som om det var en farve.

/** Felter bilkortet viser. */
export interface VehicleSummary {
  brand?: string;
  model?: string;
  variant?: string;
  year?: number;
  fuel?: string;
  colour?: string;

  /** Førstegangsregistrering, ISO-dato. Kilden til `year`. */
  firstRegistration?: string;
  /** Kilometerstand aflæst ved sidste syn. Historisk, ikke nuværende. */
  mileage?: number;
  /** Datoen kilometerstanden blev aflæst, så tallet kan sættes i kontekst. */
  mileageDate?: string;
  /** "Registreret" eller "Afmeldt". */
  status?: string;
  vin?: string;

  /** Alt vi fik fra API'et, så intet går tabt. */
  raw: Record<string, unknown>;
}

/**
 * Registerdata bruger pladsholdere i stedet for tomme værdier. De her skal
 * behandles som "ved ikke", ikke vises som indhold.
 */
const PLACEHOLDERS = new Set(["ukendt", "uoplyst", "ingen", "-", ""]);

function text(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDERS.has(trimmed.toLowerCase())) return undefined;
  return trimmed;
}

/** 0 bruges som "ikke oplyst" i flere talfelter, så det tæller ikke med. */
function positive(value: unknown): number | undefined {
  return typeof value === "number" && value > 0 ? value : undefined;
}

/**
 * Træk årstallet ud af en dato som "2010-09-17+02:00".
 *
 * Formatet er dato plus tidszone uden klokkeslæt, hvilket Date fortolker
 * upålideligt på tværs af browsere. Årstallet læses derfor direkte fra de
 * første fire cifre i stedet.
 */
function yearFromDate(value: unknown): number | undefined {
  const raw = text(value);
  const match = raw?.match(/^(\d{4})/);
  if (!match) return undefined;
  const year = Number(match[1]);
  return year >= 1900 && year <= 2100 ? year : undefined;
}

/**
 * Reducér et rå køretøjssvar til det, kortet viser. Ukendte felter bevares i
 * `raw`, så de skjulte formularfelter kan sende alt med videre.
 */
export function toVehicleSummary(raw: unknown): VehicleSummary {
  if (typeof raw !== "object" || raw === null) return { raw: {} };
  const v = raw as Record<string, unknown>;

  const mot = (v.mot_info ?? null) as Record<string, unknown> | null;

  // Førstegangsregistrering først. model_year er kun en reserve, fordi den
  // kan være 0, og yearFromDate afviser den så.
  const year = yearFromDate(v.first_registration) ?? positive(v.model_year);

  return {
    brand: text(v.make),
    model: text(v.model),
    variant: text(v.variant),
    year: year && year >= 1900 ? year : undefined,
    fuel: text(v.fuel_type),
    colour: text(v.color),

    firstRegistration: text(v.first_registration),
    mileage: mot ? positive(mot.mileage) : undefined,
    mileageDate: mot ? text(mot.date) : undefined,
    status: text(v.status),
    vin: text(v.vin),

    raw: v,
  };
}

/** Sandt hvis vi fandt nok til, at kortet siger noget meningsfuldt. */
export function hasUsableSummary(summary: VehicleSummary): boolean {
  return Boolean(summary.brand || summary.model || summary.year);
}
