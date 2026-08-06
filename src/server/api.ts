// Route-handler, skrevet mod web-standard Request/Response.
//
// Den samme funktion kan køre på Cloudflare Workers, Vercel Edge og Netlify
// Edge. Adapterne i api/ og worker/ er derfor kun få linjer hver. Det er
// bevidst: sitet ligger i dag på GitHub Pages, som ikke kan køre serverkode,
// så valget af hosting er stadig åbent, og det valg skal ikke kunne kræve, at
// logikken skrives om.
//
// Svarformatet er ens for alle udfald, og upstream-fejl og -headers når aldrig
// browseren. Klienten ser vores egne fejlkoder, ikke MotorAPI's.

import { isMotorApiError } from "./motorapi/errors";
import { hasUsableSummary, toVehicleSummary } from "./motorapi/fieldMap";
import { MotorApiService } from "./motorapi/service";
import type { MotorApiLogEvent } from "./motorapi/client";

export interface Env {
  MOTORAPI_TOKEN?: string;
  MOTORAPI_BASE_URL?: string;
  MOTORAPI_QUOTA_RESERVE?: string;
}

/** Fejlkoder klienten kan se. Bevidst grovkornede. */
export type ApiErrorCode =
  | "invalid_input"
  | "not_found"
  | "unavailable"
  | "server_error";

interface ApiErrorBody {
  error: { code: ApiErrorCode; message: string };
}

/**
 * Servicen holdes i live mellem requests, så cache og kvote-tælling overlever.
 * Nøglet på token, så en ændret konfiguration giver en frisk instans.
 */
const services = new Map<string, MotorApiService>();

function getService(env: Env): MotorApiService {
  const token = env.MOTORAPI_TOKEN;
  if (!token) throw new Error("MOTORAPI_TOKEN mangler i miljøet");

  const key = `${token}:${env.MOTORAPI_BASE_URL ?? ""}`;
  let service = services.get(key);
  if (!service) {
    service = new MotorApiService({
      config: {
        token,
        baseUrl: env.MOTORAPI_BASE_URL,
        logger: logUpstream,
      },
      reserve: env.MOTORAPI_QUOTA_RESERVE
        ? Number(env.MOTORAPI_QUOTA_RESERVE)
        : undefined,
    });
    services.set(key, service);
  }
  return service;
}

/** Serverside-log. Indeholder sti og status, aldrig tokenet. */
function logUpstream(event: MotorApiLogEvent) {
  const detail = [
    `motorapi ${event.path}`,
    `forsøg=${event.attempt}`,
    `tid=${event.durationMs}ms`,
    event.status !== undefined ? `status=${event.status}` : null,
    event.errorCode ? `fejl=${event.errorCode}` : null,
  ]
    .filter(Boolean)
    .join(" ");
  if (event.outcome === "error") console.warn(detail);
  else console.info(detail);
}

/**
 * GET /api/vehicle/:regnr
 *
 * Svarer altid med JSON. `found: false` bruges til "ingen bil på den plade",
 * fordi det ikke er en fejl i vores forstand: formularen skal kunne sendes
 * alligevel, og browseren skal bare vise manuel udfyldning.
 */
export async function handleVehicleLookup(
  regnr: string,
  env: Env,
): Promise<Response> {
  let service: MotorApiService;
  try {
    service = getService(env);
  } catch (e) {
    console.error("motorapi konfiguration mangler", e);
    return errorResponse("server_error", "Opslaget er ikke tilgængeligt", 500);
  }

  try {
    const vehicle = await service.getVehicle(regnr);
    const summary = toVehicleSummary(vehicle);
    return jsonResponse(
      {
        found: hasUsableSummary(summary),
        vehicle: summary,
        fetchedAt: new Date().toISOString(),
      },
      200,
      // Samme døgn-TTL som serverens egen cache, så browseren og eventuelle
      // mellemliggende caches ikke arbejder imod den.
      { "Cache-Control": "public, max-age=86400" },
    );
  } catch (e) {
    if (!isMotorApiError(e)) {
      console.error("motorapi uventet fejl", e);
      return errorResponse("server_error", "Noget gik galt", 500);
    }

    switch (e.code) {
      case "invalid_input":
        return errorResponse("invalid_input", e.message, 400);

      case "not_found":
        // Ikke en fejl for brugeren: vis manuel udfyldning.
        return jsonResponse({ found: false, vehicle: null }, 200);

      case "rate_limit":
      case "timeout":
      case "network":
      case "upstream":
      case "auth":
      case "invalid_response":
        // Detaljen bliver hos os. Brugeren får samme neutrale besked uanset
        // årsag, og udfylder manuelt.
        console.warn(`motorapi utilgængelig: ${e.code}`);
        return errorResponse(
          "unavailable",
          "Opslaget er ikke tilgængeligt lige nu",
          503,
        );

      default:
        return errorResponse("server_error", "Noget gik galt", 500);
    }
  }
}

function jsonResponse(
  body: unknown,
  status: number,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
): Response {
  const body: ApiErrorBody = { error: { code, message } };
  return jsonResponse(body, status, { "Cache-Control": "no-store" });
}

/** Træk :regnr ud af stien, uanset hvilken adapter der kalder. */
export function regnrFromPath(pathname: string): string | null {
  const match = pathname.match(/\/api\/vehicle\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}
