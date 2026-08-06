// Vercel-adapter for GET /api/vehicle/:regnr.
//
// Al logik ligger i src/server/api.ts. Filen her oversætter kun mellem
// Vercels edge-runtime og web-standard Request/Response, så den samme handler
// kan genbruges af Cloudflare-adapteren i worker/index.ts.
//
// Bruges kun, hvis sitet flyttes til Vercel. Bliver det på GitHub Pages,
// findes /api/* ikke, og formularen falder automatisk tilbage til manuel
// udfyldning, præcis som ved en timeout.

import { handleVehicleLookup, regnrFromPath, type Env } from "../../src/server/api";

export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: { code: "server_error", message: "Kun GET" } }), {
      status: 405,
      headers: { "Content-Type": "application/json; charset=utf-8", Allow: "GET" },
    });
  }

  const regnr = regnrFromPath(new URL(request.url).pathname);
  if (!regnr) {
    return new Response(
      JSON.stringify({
        error: { code: "invalid_input", message: "Mangler registreringsnummer" },
      }),
      { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } },
    );
  }

  // process.env findes i Vercels edge-runtime.
  const env: Env = {
    MOTORAPI_TOKEN: process.env.MOTORAPI_TOKEN,
    MOTORAPI_BASE_URL: process.env.MOTORAPI_BASE_URL,
    MOTORAPI_QUOTA_RESERVE: process.env.MOTORAPI_QUOTA_RESERVE,
  };

  return handleVehicleLookup(regnr, env);
}
