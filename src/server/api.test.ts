// Tests for route-handleren: den kontrakt browseren rent faktisk møder.
//
// Global fetch stubbes, så intet netværk røres. Hver test bruger sit eget
// token, fordi handleren holder én service-instans pr. token i live mellem
// requests — ellers ville cachen fra én test smitte af på den næste.

import { afterEach, describe, expect, it, vi } from "vitest";

import { handleVehicleLookup, regnrFromPath, type Env } from "./api";

const USAGE_OK = {
  today: { date: "2024-11-30", requests: 10, limit: 100, remaining: 90 },
  history: [],
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

let tokenTeller = 0;
function freshEnv(): Env {
  tokenTeller += 1;
  return { MOTORAPI_TOKEN: `token-${tokenTeller}` };
}

function stubFetch(handler: (url: string) => Response | Promise<Response>) {
  const spy = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/usage")) return jsonResponse(USAGE_OK);
    return handler(url);
  });
  vi.stubGlobal("fetch", spy);
  return spy;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("regnrFromPath", () => {
  it("trækker nummerpladen ud af stien", () => {
    expect(regnrFromPath("/api/vehicle/AB12345")).toBe("AB12345");
    expect(regnrFromPath("/api/vehicle/AB12345/")).toBe("AB12345");
  });

  it("returnerer null for stier uden nummerplade", () => {
    expect(regnrFromPath("/api/vehicle")).toBeNull();
    expect(regnrFromPath("/noget/andet")).toBeNull();
  });
});

describe("handleVehicleLookup", () => {
  it("svarer 200 med bildata ved succes", async () => {
    // Feltnavnene er de verificerede fra et rigtigt MotorAPI-svar.
    stubFetch(() =>
      jsonResponse({
        make: "VOLKSWAGEN",
        model: "POLO",
        variant: "1,6 TDI",
        first_registration: "2010-09-17+02:00",
        fuel_type: "Diesel",
      }),
    );

    const response = await handleVehicleLookup("AB12345", freshEnv());
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.found).toBe(true);
    expect(body.vehicle.brand).toBe("VOLKSWAGEN");
    expect(body.vehicle.year).toBe(2010);
    expect(typeof body.fetchedAt).toBe("string");
  });

  it("svarer 200 med found: false ved 404, så formularen kan sendes alligevel", async () => {
    stubFetch(() => jsonResponse({}, 404));

    const response = await handleVehicleLookup("AB12345", freshEnv());
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.found).toBe(false);
    expect(body.vehicle).toBeNull();
  });

  it("svarer 200 med found: false når svaret er tomt", async () => {
    stubFetch(() => jsonResponse({}));

    const response = await handleVehicleLookup("AB12345", freshEnv());
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.found).toBe(false);
  });

  it("svarer 400 på ugyldig plade uden at kalde MotorAPI", async () => {
    const spy = stubFetch(() => jsonResponse({}));

    const response = await handleVehicleLookup("AB1", freshEnv());
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error.code).toBe("invalid_input");
    expect(spy).not.toHaveBeenCalled();
  });

  it("skjuler 401 bag en neutral fejl, så tokenproblemer ikke lækker", async () => {
    stubFetch(() => jsonResponse({ message: "invalid token" }, 401));

    const response = await handleVehicleLookup("AB12345", freshEnv());
    expect(response.status).toBe(503);

    const body = await response.json();
    expect(body.error.code).toBe("unavailable");
    expect(JSON.stringify(body)).not.toContain("invalid token");
  });

  it("skjuler rate limit bag samme neutrale fejl", async () => {
    stubFetch(() => jsonResponse({}, 429));

    const response = await handleVehicleLookup("AB12345", freshEnv());
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error.code).toBe("unavailable");
  });

  it("behandler timeout som utilgængelig", async () => {
    stubFetch(() => {
      const err = new Error("aborted");
      err.name = "AbortError";
      throw err;
    });

    const response = await handleVehicleLookup("AB12345", freshEnv());
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error.code).toBe("unavailable");
  }, 20_000);

  it("svarer 500 hvis tokenet mangler i miljøet", async () => {
    stubFetch(() => jsonResponse({}));

    const response = await handleVehicleLookup("AB12345", {});
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.error.code).toBe("server_error");
  });

  it("videresender aldrig upstream-headers", async () => {
    stubFetch(
      () =>
        new Response(JSON.stringify({ make: "VW" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "X-Upstream-Secret": "må ikke ud",
            "Set-Cookie": "session=hemmelig",
          },
        }),
    );

    const response = await handleVehicleLookup("AB12345", freshEnv());
    expect(response.headers.get("X-Upstream-Secret")).toBeNull();
    expect(response.headers.get("Set-Cookie")).toBeNull();
  });
});
