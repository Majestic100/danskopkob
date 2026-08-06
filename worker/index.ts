// Cloudflare Worker-adapter.
//
// Bruges, hvis sitet bliver liggende på GitHub Pages, og serverlaget i stedet
// deployes for sig, fx på api.minbilpris.dk. Al logik ligger i
// src/server/api.ts; her håndteres kun routing og CORS.
//
// CORS er nødvendigt i netop denne opsætning, fordi browseren så kalder et
// andet domæne end det, siden ligger på. Vælges Vercel i stedet, ligger
// /api/* på samme domæne, og hele CORS-delen er overflødig.

import { handleVehicleLookup, regnrFromPath, type Env } from "../src/server/api";

/** Kun vores egne domæner må kalde API'et fra en browser. */
const ALLOWED_ORIGINS = [
  "https://minbilpris.dk",
  "https://www.minbilpris.dk",
  "http://localhost:5173",
];

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "GET") {
      return withHeaders(
        jsonError("server_error", "Kun GET", 405),
        { ...cors, Allow: "GET" },
      );
    }

    const regnr = regnrFromPath(new URL(request.url).pathname);
    if (!regnr) {
      return withHeaders(
        jsonError("invalid_input", "Mangler registreringsnummer", 400),
        cors,
      );
    }

    const response = await handleVehicleLookup(regnr, env);
    return withHeaders(response, cors);
  },
};

function jsonError(code: string, message: string, status: number): Response {
  return new Response(JSON.stringify({ error: { code, message } }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Kopiér svaret med ekstra headers. Response-headers er ellers låst. */
function withHeaders(response: Response, extra: Record<string, string>) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
