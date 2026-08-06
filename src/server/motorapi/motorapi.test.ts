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
    const fetchImpl = mockFetch(() => jsonResponse({ maerke: "VW" }));
    const service = makeService(fetchImpl);

    await service.getVehicle(" ab-12 345 ");
    const kaldte = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls
      .map(([url]) => String(url))
      .filter((url) => url.includes("/vehicles/"));
    expect(kaldte[0]).toContain("/vehicles/AB12345");
  });

  it("cacher svaret, så samme plade kun koster ét kald", async () => {
    const fetchImpl = mockFetch(() => jsonResponse({ maerke: "VW" }));
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
      return jsonResponse({ maerke: "VW" });
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
      jsonResponse({ data: [{ maerke: "VW" }] }),
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

describe("toVehicleSummary", () => {
  // UVERIFICERET: feltnavnene her er kandidater, ikke bekræftede navne fra
  // MotorAPI. Testen viser, at opslaget rammer på tværs af kandidatlisten.
  it("læser danske feltnavne", () => {
    const summary = toVehicleSummary({
      maerke: "Volkswagen",
      model: "Passat",
      variant: "2.0 TDI",
      aargang: "2017",
      braendstof: "Diesel",
      farve: "Sort",
    });

    expect(summary.brand).toBe("Volkswagen");
    expect(summary.year).toBe(2017);
    expect(summary.fuel).toBe("Diesel");
  });

  it("læser engelske feltnavne", () => {
    const summary = toVehicleSummary({ brand: "BMW", model_year: "2019" });
    expect(summary.brand).toBe("BMW");
    expect(summary.year).toBe(2019);
  });

  it("trækker årstal ud af en dato", () => {
    expect(toVehicleSummary({ aargang: "2018-04-12" }).year).toBe(2018);
  });

  it("klarer et tomt svar uden at kaste", () => {
    expect(toVehicleSummary(null).raw).toEqual({});
    expect(toVehicleSummary({}).brand).toBeUndefined();
  });
});
