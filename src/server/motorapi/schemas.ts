// Zod-schemas for MotorAPI.
//
// VIGTIGT OM VERIFIKATIONSSTATUS
//
// Kun /usage er specificeret eksakt i dokumentationen, og kun det schema er
// derfor stramt. Felterne i køretøjssvarene er IKKE dokumenteret, og der ligger
// endnu ingen samples/*.json i repoet at udlede dem fra. Derfor:
//
//   VERIFICERET    UsageSchema. Struktur taget direkte fra dokumentationen.
//   UVERIFICERET   Alt om køretøjer. Schemaerne herunder validerer kun, at
//                  svaret er et objekt (henholdsvis et array af objekter), og
//                  lader alle felter passere urørt.
//
// Det er et bevidst valg frem for at gætte feltnavne. Et for stramt schema
// ville afvise gyldige svar og tage nummerplade-opslaget ned; et gættet
// feltnavn ville se verificeret ud i koden uden at være det. Kortet i
// browseren læser derfor felter gennem kandidatlisterne i fieldMap.ts, hvor
// det står tydeligt, hvad der mangler bekræftelse.
//
// NÅR SAMPLES ANKOMMER: erstat passthrough-schemaerne her med rigtige felter,
// og skriv kandidatlisterne i fieldMap.ts om til de faktiske navne.

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
 * UVERIFICERET. Et køretøj er indtil videre "et objekt med ukendte felter".
 * passthrough() bevarer alt, så intet går tabt på vej til browseren.
 */
export const VehicleSchema = z.object({}).passthrough();
export type Vehicle = z.infer<typeof VehicleSchema>;

/**
 * UVERIFICERET. GET /vehicles returnerer en liste. Dokumentationen siger, at
 * et tomt array betyder "ingen resultater", hvilket ikke er en fejl.
 *
 * Nogle API'er pakker lister ind i et objekt ({ data: [...] }), og det er
 * ikke oplyst, om MotorAPI gør det. Begge former accepteres derfor og
 * normaliseres til et array af unwrapVehicleList().
 */
export const VehicleListSchema = z.union([
  z.array(VehicleSchema),
  z.object({ data: z.array(VehicleSchema) }).passthrough(),
]);

export function unwrapVehicleList(parsed: z.infer<typeof VehicleListSchema>) {
  return Array.isArray(parsed) ? parsed : parsed.data;
}

/** UVERIFICERET. Miljødata: emissioner, brændstoftype m.m. */
export const EnvironmentSchema = z.object({}).passthrough();
export type VehicleEnvironment = z.infer<typeof EnvironmentSchema>;

/** UVERIFICERET. Registreret udstyr. */
export const EquipmentSchema = z
  .union([z.array(z.unknown()), z.object({}).passthrough()])
  .transform((v) => (Array.isArray(v) ? { items: v } : v));
export type VehicleEquipment = z.infer<typeof EquipmentSchema>;
