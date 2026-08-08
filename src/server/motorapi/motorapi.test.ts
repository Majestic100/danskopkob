// Tests for MotorAPI-laget. Alle svar er mockede — testene rører aldrig
// netværket og bruger derfor ingen af dagskvoten.

import { describe, expect, it, vi } from "vitest";

import { TtlCache } from "./cache";
import { motorApiRequest } from "./client";
import {
  AuthError,
  InvalidInputError,
  NotFoundError,
  RateLimitError,
  TimeoutError,
  UpstreamError,
} from "./errors";
import { toVehicleSummary } from "./fieldMap";
import { QuotaGuard } from "./quota";
import { VehicleSchema } from "./schemas";
import { MotorApiService } from "./service";

const TOKEN = "test-token";

/** Byg et fetch-svar uden at røre netværket. */
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Rigelig kvote, så kvote-guarden ikke spænder ben i de øvrige tests. */
const USAGE_OK = {
  today: { date: "2024-11-30", requests: 10, limit: 100, remaining: 90 },
  history: [],
};

/**
 * Fetch-mock der svarer efter sti. /usage får altid et gyldigt svar, så tests
 * kun behøver forholde sig til det endpoint, de handler om.
 */
function mockFetch(handler: (url: string) => Response | Promise<Response>) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/usage")) return jsonResponse(USAGE_OK);
    return handler(url);
  }) as unknown as typeof fetch;
}

function makeService(fetchImpl: typeof fetch, now = () => 1_700_000_000_000) {
  return new MotorApiService({
    config: { token: TOKEN, fetchImpl, sleepImpl: async () => {} },
    now,
  });
}

describe("motorApiRequest", () => {
  it("sender X-AUTH-TOKEN med og returnerer svaret ved succes", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({ ok: true }));
    const body = await motorApiRequest<{ ok: boolean }>("/vehicles/AB12345", {
      token: TOKEN,
      fetchImpl,
    });

    expect(body).toEqual({ ok: true });
    const [, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect((init as RequestInit).headers).toMatchObject({
      "X-AUTH-TOKEN": TOKEN,
    });
  });

  it("oversætter 404 til NotFoundError uden at prøve igen", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({}, 404));
    await expect(
      motorApiRequest("/vehicles/AB12345", { token: TOKEN, fetchImpl }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("oversætter 401 til AuthError uden at prøve igen", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({}, 401));
    await expect(
      motorApiRequest("/vehicles/AB12345", { token: TOKEN, fetchImpl }),
    ).rejects.toBeInstanceOf(AuthError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("oversætter 429 til RateLimitError uden at prøve igen", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({}, 429));
    await expect(
      motorApiRequest("/vehicles/AB12345", { token: TOKEN, fetchImpl }),
    ).rejects.toBeInstanceOf(RateLimitError);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("prøver igen ved 5xx og giver op efter tre forsøg", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({}, 503));
    await expect(
      motorApiRequest("/vehicles/AB12345", {
        token: TOKEN,
        fetchImpl,
        sleepImpl: async () => {},
      }),
    ).rejects.toBeInstanceOf(UpstreamError);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("prøver igen efter en 5xx og lykkes på andet forsøg", async () => {
    let calls = 0;
    const fetchImpl = mockFetch(() => {
      calls += 1;
      return calls === 1 ? jsonResponse({}, 500) : jsonResponse({ ok: true });
    });

    const body = await motorApiRequest<{ ok: boolean }>("/vehicles/AB12345", {
      token: TOKEN,
      fetchImpl,
      sleepImpl: async () => {},
    });
    expect(body).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it("oversætter afbrudt request til TimeoutError", async () => {
    const fetchImpl = mockFetch(() => {
      const err = new Error("aborted");
      err.name = "AbortError";
      throw err;
    });

    await expect(
      motorApiRequest("/vehicles/AB12345", {
        token: TOKEN,
        fetchImpl,
        sleepImpl: async () => {},
      }),
    ).rejects.toBeInstanceOf(TimeoutError);
  });
});

describe("MotorApiService.getVehicle", () => {
  it("afviser ugyldig plade lokalt uden at kalde ud", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({}));
    const service = makeService(fetchImpl);

    await expect(service.getVehicle("AB1")).rejects.toBeInstanceOf(
      InvalidInputError,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("normaliserer input før kaldet", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({ make: "VW" }));
    const service = makeService(fetchImpl);

    await service.getVehicle(" ab-12 345 ");
    const kaldte = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls
      .map(([url]) => String(url))
      .filter((url) => url.includes("/vehicles/"));
    expect(kaldte[0]).toContain("/vehicles/AB12345");
  });

  it("cacher svaret, så samme plade kun koster ét kald", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({ make: "VW" }));
    const service = makeService(fetchImpl);

    await service.getVehicle("AB12345");
    await service.getVehicle("AB12345");

    const vehicleCalls = (
      fetchImpl as unknown as ReturnType<typeof vi.fn>
    ).mock.calls.filter(([url]) => String(url).includes("/vehicles/"));
    expect(vehicleCalls).toHaveLength(1);
  });

  it("deduplikerer samtidige kald på samme plade", async () => {
    let vehicleCalls = 0;
    const fetchImpl = mockFetch(async () => {
      vehicleCalls += 1;
      await new Promise((r) => setTimeout(r, 10));
      return jsonResponse({ make: "VW" });
    });
    const service = makeService(fetchImpl);

    await Promise.all([
      service.getVehicle("AB12345"),
      service.getVehicle("AB12345"),
      service.getVehicle("AB12345"),
    ]);
    expect(vehicleCalls).toBe(1);
  });

  it("lader NotFoundError boble op ved 404", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({}, 404));
    const service = makeService(fetchImpl);
    await expect(service.getVehicle("AB12345")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

describe("MotorApiService.listVehicles", () => {
  it("behandler tomt array som gyldigt svar, ikke som fejl", async () => {
    const fetchImpl = mockFetch(() => jsonResponse([]));
    const service = makeService(fetchImpl);

    await expect(service.listVehicles("AB12345")).resolves.toEqual([]);
  });

  it("pakker { data: [...] } ud til et array", async () => {
    const fetchImpl = mockFetch(() =>
      jsonResponse({ data: [{ make: "VW" }] }),
    );
    const service = makeService(fetchImpl);

    const liste = await service.listVehicles("AB12345");
    expect(liste).toHaveLength(1);
  });

  it("sender registration_number med som query-parameter", async () => {
    const fetchImpl = mockFetch(() => jsonResponse([]));
    const service = makeService(fetchImpl);

    await service.listVehicles("AB12345", "registreret");
    const url = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls
      .map(([u]) => String(u))
      .find((u) => u.includes("/vehicles?"));
    expect(url).toContain("registration_number=AB12345");
    expect(url).toContain("status=registreret");
  });
});

describe("QuotaGuard", () => {
  it("stopper opslag når kun reserven er tilbage", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({}));
    const guard = new QuotaGuard(
      { token: TOKEN, fetchImpl: mockUsage({ remaining: 3 }) },
      5,
    );
    await expect(guard.assertHasQuota()).rejects.toBeInstanceOf(RateLimitError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("lader opslag passere når der er kvote nok", async () => {
    const guard = new QuotaGuard(
      { token: TOKEN, fetchImpl: mockUsage({ remaining: 90 }) },
      5,
    );
    await expect(guard.assertHasQuota()).resolves.toBeUndefined();
  });

  it("henter kun /usage én gang inden for cache-vinduet", async () => {
    const usageFetch = mockUsage({ remaining: 90 });
    const guard = new QuotaGuard({ token: TOKEN, fetchImpl: usageFetch }, 5);

    await guard.assertHasQuota();
    await guard.assertHasQuota();
    await guard.assertHasQuota();

    expect(usageFetch).toHaveBeenCalledTimes(1);
  });

  it("blokerer ikke opslag hvis /usage selv fejler", async () => {
    const failing = vi.fn(async () =>
      jsonResponse({}, 500),
    ) as unknown as typeof fetch;
    const guard = new QuotaGuard(
      { token: TOKEN, fetchImpl: failing, sleepImpl: async () => {} },
      5,
    );
    await expect(guard.assertHasQuota()).resolves.toBeUndefined();
  });
});

function mockUsage(today: { remaining: number }) {
  return vi.fn(async () =>
    jsonResponse({
      today: {
        date: "2024-11-30",
        requests: 100 - today.remaining,
        limit: 100,
        remaining: today.remaining,
      },
      history: [],
    }),
  ) as unknown as typeof fetch;
}

describe("TtlCache", () => {
  it("udleverer cachet værdi indtil TTL udløber", async () => {
    let nu = 0;
    const cache = new TtlCache<string>({ ttlMs: 1000, now: () => nu });
    const produce = vi.fn(async () => "værdi");

    await cache.fetch("k", produce);
    await cache.fetch("k", produce);
    expect(produce).toHaveBeenCalledTimes(1);

    nu = 1500;
    await cache.fetch("k", produce);
    expect(produce).toHaveBeenCalledTimes(2);
  });

  it("cacher ikke fejl", async () => {
    const cache = new TtlCache<string>({ ttlMs: 1000 });
    const fejler = vi.fn(async () => {
      throw new Error("nej");
    });

    await expect(cache.fetch("k", fejler)).rejects.toThrow();
    await expect(cache.fetch("k", fejler)).rejects.toThrow();
    expect(fejler).toHaveBeenCalledTimes(2);
  });
});

/**
 * Rigtigt svar fra GET /vehicles/{reg-nr}, hentet 2026-08-06.
 *
 * Bevaret ordret, inklusive de skæve værdier: model_year er 0, color er
 * "Ukendt", og chassis_type er tom. Netop dem gør fixturen værdifuld — de
 * viser, hvordan registerdata faktisk ser ud, ikke hvordan man håber.
 */
const VW_POLO = {
  registration_number: "AB12345",
  status: "Registreret",
  status_date: "2011-06-07T00:00:00.000+02:00",
  type: "Personbil",
  use: "Privat personkørsel",
  first_registration: "2010-09-17+02:00",
  vin: "WVWZZZ0000Y000000",
  own_weight: null,
  cerb_weight: 1215,
  total_weight: 1650,
  axels: 2,
  pulling_axels: 1,
  seats: 1,
  coupling: false,
  trailer_maxweight_nobrakes: null,
  trailer_maxweight_withbrakes: null,
  doors: null,
  make: "VOLKSWAGEN",
  model: "POLO",
  variant: "1,6 TDI",
  model_type: "6R",
  model_year: 0,
  color: "Ukendt",
  chassis_type: "",
  engine_cylinders: 0,
  engine_volume: 1598,
  engine_power: 66,
  fuel_type: "Diesel",
  is_hybrid: false,
  hybrid_type: "mild",
  registration_zipcode: "",
  vehicle_id: 1027901201016889,
  mot_info: {
    type: "PeriodiskSyn",
    date: "2024-10-30",
    result: "Godkendt",
    status: "Aktiv",
    status_date: "2024-10-30",
    mileage: 247000,
    next_inspection_date: "2026-10-30",
  },
  is_leasing: false,
  leasing_from: null,
  leasing_to: null,
};

describe("toVehicleSummary", () => {
  it("læser de verificerede feltnavne fra et rigtigt svar", () => {
    const summary = toVehicleSummary(VW_POLO);

    expect(summary.brand).toBe("VOLKSWAGEN");
    expect(summary.model).toBe("POLO");
    expect(summary.variant).toBe("1,6 TDI");
    expect(summary.fuel).toBe("Diesel");
    expect(summary.vin).toBe("WVWZZZ0000Y000000");
    expect(summary.status).toBe("Registreret");
  });

  it("udleder årgang af first_registration, ikke af model_year", () => {
    // model_year er 0 for denne bil. Læste vi den, ville kortet vise "0".
    expect(toVehicleSummary(VW_POLO).year).toBe(2010);
  });

  it('behandler "Ukendt" som fraværende i stedet for som en farve', () => {
    expect(toVehicleSummary(VW_POLO).colour).toBeUndefined();
  });

  it("tager kilometerstand og aflæsningsdato med fra synet", () => {
    const summary = toVehicleSummary(VW_POLO);
    expect(summary.mileage).toBe(247000);
    expect(summary.mileageDate).toBe("2024-10-30");
  });

  it("falder tilbage til model_year, når den er troværdig", () => {
    const summary = toVehicleSummary({ make: "BMW", model_year: 2019 });
    expect(summary.year).toBe(2019);
  });

  it("afviser årstal uden for et rimeligt interval", () => {
    expect(toVehicleSummary({ first_registration: "1823-01-01" }).year)
      .toBeUndefined();
    expect(toVehicleSummary({ model_year: 0 }).year).toBeUndefined();
  });

  it("regner kW om til hestekræfter", () => {
    // 66 kW × 1,35962 = 89,7 → 90 hk. Motorregistret oplyser kW, men det er
    // hestekræfter, folk kender deres bil på.
    expect(toVehicleSummary(VW_POLO).hp).toBe(90);
  });

  it("regner kubikcentimeter om til liter", () => {
    expect(toVehicleSummary(VW_POLO).litres).toBe(1.6);
  });

  it("tager næste syn og køretøjstype med", () => {
    const summary = toVehicleSummary(VW_POLO);
    expect(summary.nextInspection).toBe("2026-10-30");
    expect(summary.inspectionResult).toBe("Godkendt");
    expect(summary.type).toBe("Personbil");
  });

  it("markerer leasing, så det kan tages op inden der gives tilbud", () => {
    expect(toVehicleSummary(VW_POLO).isLeasing).toBe(false);
    expect(toVehicleSummary({ is_leasing: true }).isLeasing).toBe(true);
  });

  it("udelader motortal, når de er nul", () => {
    // engine_cylinders er 0 i det rigtige svar. Samme mønster kan ramme
    // effekt og volumen, fx på ældre eller udenlandske køretøjer.
    const summary = toVehicleSummary({ engine_power: 0, engine_volume: 0 });
    expect(summary.hp).toBeUndefined();
    expect(summary.litres).toBeUndefined();
  });

  it("bevarer hele det rå svar", () => {
    expect(toVehicleSummary(VW_POLO).raw).toEqual(VW_POLO);
  });

  it("klarer et tomt svar uden at kaste", () => {
    expect(toVehicleSummary(null).raw).toEqual({});
    expect(toVehicleSummary({}).brand).toBeUndefined();
  });
});

describe("VehicleSchema", () => {
  it("accepterer det rigtige svar uændret", () => {
    const parsed = VehicleSchema.safeParse(VW_POLO);
    expect(parsed.success).toBe(true);
  });

  it("accepterer et svar med felter vi ikke kender", () => {
    const parsed = VehicleSchema.safeParse({ ...VW_POLO, nyt_felt: "værdi" });
    expect(parsed.success).toBe(true);
    // passthrough: ukendte felter skal bevares, ikke smides væk.
    expect(parsed.success && parsed.data.nyt_felt).toBe("værdi");
  });

  it("accepterer et sparsomt svar, hvor de fleste felter mangler", () => {
    // En elbil har ingen motorvolumen, et afmeldt køretøj måske intet syn.
    expect(VehicleSchema.safeParse({ make: "TESLA" }).success).toBe(true);
  });
});
