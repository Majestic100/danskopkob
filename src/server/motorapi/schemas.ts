// Zod-schemas for MotorAPI.
//
// VERIFIKATIONSSTATUS
//
//   VERIFICERET    /usage (mod dokumentationen) og VehicleSchema (mod et
//                  rigtigt svar fra GET /vehicles/{reg-nr}, hentet 2026-08-06).
//   UVERIFICERET   /environment og /equipment. Ingen af dem er kaldt endnu.
//
// Selv de verificerede køretøjsfelter er skrevet tolerant: alt er optional, og
// passthrough() bevarer felter, vi ikke kender. Ét svar viser, hvilke felter
// der findes for én bil, ikke hvilke der altid findes. En elbil har ikke
// motorvolumen, en varebil har andre vægtfelter, og et afmeldt køretøj kan
// mangle syn. Et strammere schema ville afvise dem og tage opslaget ned.

import { z } from "zod";

/** VERIFICERET mod dokumentationen. */
export const UsageSchema = z.object({
  today: z.object({
    date: z.string(),
    requests: z.number(),
    limit: z.number(),
    remaining: z.number(),
  }),
  history: z
    .array(
      z.object({
        month: z.number(),
        year: z.number(),
        requests: z.number(),
      }),
    )
    .optional()
    .default([]),
});

export type Usage = z.infer<typeof UsageSchema>;

/**
 * Synsoplysninger. `mileage` er kilometerstanden aflæst ved synet og er
 * dermed historisk — den siger noget om bilen på `date`, ikke i dag.
 */
const MotInfoSchema = z
  .object({
    type: z.string().nullish(),
    date: z.string().nullish(),
    result: z.string().nullish(),
    status: z.string().nullish(),
    status_date: z.string().nullish(),
    mileage: z.number().nullish(),
    next_inspection_date: z.string().nullish(),
  })
  .passthrough();

/**
 * VERIFICERET mod et rigtigt svar. Feltnavnene er engelske og i snake_case,
 * også selvom værdierne er danske ("Registreret", "Personbil", "Diesel").
 *
 * Bemærk to fælder, som det rigtige svar afslørede:
 *
 *   model_year kan være 0. Ikke null, ikke fraværende — nul. Årgangen skal
 *   derfor udledes af first_registration, som er den dato, bilen kom på
 *   vejen første gang.
 *
 *   Tekstfelter kan indeholde "Ukendt" eller tom streng i stedet for null.
 *   De skal behandles som fraværende, ikke vises som en værdi.
 *
 * Begge håndteres i fieldMap.ts.
 */
export const VehicleSchema = z
  .object({
    registration_number: z.string().nullish(),
    status: z.string().nullish(),
    status_date: z.string().nullish(),
    type: z.string().nullish(),
    use: z.string().nullish(),
    first_registration: z.string().nullish(),
    vin: z.string().nullish(),

    make: z.string().nullish(),
    model: z.string().nullish(),
    variant: z.string().nullish(),
    model_type: z.string().nullish(),
    model_year: z.number().nullish(),
    color: z.string().nullish(),
    chassis_type: z.string().nullish(),
    doors: z.number().nullish(),
    seats: z.number().nullish(),

    fuel_type: z.string().nullish(),
    is_hybrid: z.boolean().nullish(),
    hybrid_type: z.string().nullish(),
    engine_cylinders: z.number().nullish(),
    engine_volume: z.number().nullish(),
    engine_power: z.number().nullish(),

    own_weight: z.number().nullish(),
    cerb_weight: z.number().nullish(),
    total_weight: z.number().nullish(),
    axels: z.number().nullish(),
    pulling_axels: z.number().nullish(),
    coupling: z.boolean().nullish(),
    trailer_maxweight_nobrakes: z.number().nullish(),
    trailer_maxweight_withbrakes: z.number().nullish(),

    mot_info: MotInfoSchema.nullish(),
    is_leasing: z.boolean().nullish(),
    leasing_from: z.string().nullish(),
    leasing_to: z.string().nullish(),

    registration_zipcode: z.string().nullish(),
    vehicle_id: z.number().nullish(),
  })
  .passthrough();

export type Vehicle = z.infer<typeof VehicleSchema>;

/**
 * GET /vehicles returnerer en liste. Dokumentationen siger, at et tomt array
 * betyder "ingen resultater", hvilket ikke er en fejl.
 *
 * UVERIFICERET: det er ikke bekræftet, om listen kommer bar eller pakket ind
 * i { data: [...] }. Begge former accepteres og normaliseres til et array.
 */
export const VehicleListSchema = z.union([
  z.array(VehicleSchema),
  z.object({ data: z.array(VehicleSchema) }).passthrough(),
]);

export function unwrapVehicleList(parsed: z.infer<typeof VehicleListSchema>) {
  return Array.isArray(parsed) ? parsed : parsed.data;
}

/** UVERIFICERET. Endpointet er ikke kaldt endnu. */
export const EnvironmentSchema = z.object({}).passthrough();
export type VehicleEnvironment = z.infer<typeof EnvironmentSchema>;

/** UVERIFICERET. Endpointet er ikke kaldt endnu. */
export const EquipmentSchema = z
  .union([z.array(z.unknown()), z.object({}).passthrough()])
  .transform((v) => (Array.isArray(v) ? { items: v } : v));
export type VehicleEquipment = z.infer<typeof EquipmentSchema>;
