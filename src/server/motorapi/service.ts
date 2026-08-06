// Servicelaget: det route-handleren kalder.
//
// Her sættes brikkerne sammen: normalisering og lokal validering, kvote-guard,
// cache med deduplikering, og til sidst selve kaldet. Rækkefølgen er
// bevidst — input afvises lokalt før kvoten tjekkes, og cachen tjekkes før
// kvoten trækkes, så et cache-hit hverken koster kvote eller rundtur.

import type { ZodType } from "zod";

// Relativ sti med vilje: serverkoden bygges af Vercel eller wrangler, ikke af
// Vite, og de bundlere kender ikke nødvendigvis "@/"-aliaset.
import { isLookupable, normalizePlate } from "../../lib/plate";
import { TtlCache } from "./cache";
import { motorApiRequest, type MotorApiConfig } from "./client";
import { InvalidInputError, InvalidResponseError, NotFoundError } from "./errors";
import { QuotaGuard } from "./quota";
import {
  EnvironmentSchema,
  EquipmentSchema,
  VehicleListSchema,
  VehicleSchema,
  unwrapVehicleList,
  type Vehicle,
  type VehicleEnvironment,
  type VehicleEquipment,
} from "./schemas";

/** Køretøjsdata ændrer sig sjældent. Et døgn er rigeligt friskt. */
const VEHICLE_TTL_MS = 24 * 60 * 60 * 1000;

export interface ServiceOptions {
  config: MotorApiConfig;
  reserve?: number;
  now?: () => number;
}

export class MotorApiService {
  private readonly config: MotorApiConfig;
  private readonly quota: QuotaGuard;
  private readonly vehicles: TtlCache<Vehicle>;
  private readonly vehicleLists: TtlCache<Vehicle[]>;
  private readonly environments: TtlCache<VehicleEnvironment>;
  private readonly equipment: TtlCache<VehicleEquipment>;

  constructor({ config, reserve, now = Date.now }: ServiceOptions) {
    this.config = config;
    this.quota = new QuotaGuard(config, reserve, now);
    const cacheOptions = { ttlMs: VEHICLE_TTL_MS, now };
    this.vehicles = new TtlCache<Vehicle>(cacheOptions);
    this.vehicleLists = new TtlCache<Vehicle[]>(cacheOptions);
    this.environments = new TtlCache<VehicleEnvironment>(cacheOptions);
    this.equipment = new TtlCache<VehicleEquipment>(cacheOptions);
  }

  /**
   * GET /vehicles/{reg-no-or-vin} — detaljer for et registreret køretøj.
   * Kaster NotFoundError, hvis nummerpladen ikke findes.
   */
  async getVehicle(input: string): Promise<Vehicle> {
    const key = this.requireLookupable(input);
    return this.vehicles.fetch(key, async () => {
      await this.quota.assertHasQuota();
      const raw = await this.spend(() =>
        motorApiRequest<unknown>(`/vehicles/${encodeURIComponent(key)}`, this.config),
      );
      return this.parse(VehicleSchema, raw, "køretøj");
    });
  }

  /**
   * GET /vehicles?registration_number=… — listen over køretøjer på en plade,
   * både registrerede og afmeldte.
   *
   * Et tomt array er et gyldigt svar og betyder "ingen resultater". Det er
   * ikke en fejl og bliver derfor ikke oversat til NotFoundError her.
   */
  async listVehicles(
    input: string,
    status?: "registreret" | "afmeldt",
  ): Promise<Vehicle[]> {
    const key = this.requireLookupable(input);
    const cacheKey = status ? `${key}:${status}` : key;
    return this.vehicleLists.fetch(cacheKey, async () => {
      await this.quota.assertHasQuota();
      const raw = await this.spend(() =>
        motorApiRequest<unknown>("/vehicles", this.config, {
          registration_number: key,
          status,
        }),
      );
      const parsed = VehicleListSchema.safeParse(raw);
      if (!parsed.success) {
        throw new InvalidResponseError("Uventet svar fra /vehicles");
      }
      return unwrapVehicleList(parsed.data);
    });
  }

  /**
   * GET /vehicles/{reg-no-or-vin}/environment — miljødata.
   *
   * FORBEHOLD fra dokumentationen: slås der op på et registreringsnummer med
   * flere match, returneres registrerede køretøjer, hvis der findes nogen, og
   * ellers det første match. Svaret kan altså tilhøre et andet køretøj end
   * det, brugeren har i tankerne, hvis pladen har været genbrugt.
   */
  async getEnvironment(input: string): Promise<VehicleEnvironment> {
    const key = this.requireLookupable(input);
    return this.environments.fetch(key, async () => {
      await this.quota.assertHasQuota();
      const raw = await this.spend(() =>
        motorApiRequest<unknown>(
          `/vehicles/${encodeURIComponent(key)}/environment`,
          this.config,
        ),
      );
      return this.parse(EnvironmentSchema, raw, "miljødata");
    });
  }

  /**
   * GET /vehicles/{reg-no-or-vin}/equipment — registreret udstyr.
   *
   * Samme forbehold om flere match som getEnvironment.
   */
  async getEquipment(input: string): Promise<VehicleEquipment> {
    const key = this.requireLookupable(input);
    return this.equipment.fetch(key, async () => {
      await this.quota.assertHasQuota();
      const raw = await this.spend(() =>
        motorApiRequest<unknown>(
          `/vehicles/${encodeURIComponent(key)}/equipment`,
          this.config,
        ),
      );
      const parsed = EquipmentSchema.safeParse(raw);
      if (!parsed.success) {
        throw new InvalidResponseError("Uventet svar fra /equipment");
      }
      return parsed.data;
    });
  }

  /**
   * Normalisér og afvis lokalt. Et opslag på "AB1" må aldrig koste kvote,
   * så det stoppes her i stedet for hos MotorAPI.
   */
  private requireLookupable(input: string): string {
    const normalized = normalizePlate(input);
    if (!isLookupable(normalized)) {
      throw new InvalidInputError(
        "Indtast en gyldig dansk nummerplade, fx AB 12 345",
      );
    }
    return normalized;
  }

  /** Tæl kaldet med i kvoteforbruget, uanset om det lykkedes. */
  private async spend<T>(run: () => Promise<T>): Promise<T> {
    try {
      return await run();
    } finally {
      this.quota.recordSpend();
    }
  }

  private parse<T>(schema: ZodType<T>, raw: unknown, label: string): T {
    // Et 200-svar med null body behandles som "ikke fundet".
    if (raw === null || raw === undefined) throw new NotFoundError();
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      throw new InvalidResponseError(`Uventet svar for ${label}`);
    }
    return parsed.data;
  }
}
