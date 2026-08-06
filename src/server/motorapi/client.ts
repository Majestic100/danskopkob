// Den ene funktion, der taler med MotorAPI. Alt andet går gennem den.
//
// Den sætter auth-headeren, håndhæver en 10 sekunders grænse, oversætter
// status til typede fejl og prøver igen ved 5xx og netværksfejl. Aldrig ved
// 4xx: en 404 bliver ikke til en 200, fordi man spørger tre gange, og et
// gentaget kald ville bare bruge mere af dagskvoten.

import {
  AuthError,
  InvalidResponseError,
  MotorApiError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  TimeoutError,
  UpstreamError,
} from "./errors";

export const DEFAULT_BASE_URL = "https://v1.motorapi.dk";
export const DEFAULT_TIMEOUT_MS = 10_000;

const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 300;

export interface MotorApiConfig {
  token: string;
  baseUrl?: string;
  timeoutMs?: number;
  /** Injicerbar fetch, så tests kan svare uden netværk. */
  fetchImpl?: typeof fetch;
  /** Injicerbar ventefunktion, så tests slipper for at vente på backoff. */
  sleepImpl?: (ms: number) => Promise<void>;
  /** Serverside-log. Får aldrig tokenet at se. */
  logger?: (event: MotorApiLogEvent) => void;
}

export interface MotorApiLogEvent {
  path: string;
  status?: number;
  attempt: number;
  durationMs: number;
  outcome: "ok" | "error";
  errorCode?: string;
}

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Kald et MotorAPI-endpoint og returnér det parsede JSON-svar.
 *
 * `path` skal starte med "/" og være færdig-encodet af kalderen.
 * `query` bliver til en query-string. Dokumentationen nævner, at parametre
 * uden for URL'en sendes som JSON body, men alle de endpoints vi bruger er
 * GET med parametre i stien eller query-strengen, så body bruges ikke her.
 */
export async function motorApiRequest<T = unknown>(
  path: string,
  config: MotorApiConfig,
  query?: Record<string, string | undefined>,
): Promise<T> {
  const { sleepImpl = defaultSleep, logger } = config;
  const url = buildUrl(path, config.baseUrl ?? DEFAULT_BASE_URL, query);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const startedAt = Date.now();
    try {
      const { body, status } = await attemptOnce<T>(url, config);
      logger?.({
        path,
        status,
        attempt,
        durationMs: Date.now() - startedAt,
        outcome: "ok",
      });
      return body;
    } catch (e) {
      const error = toMotorApiError(e);
      logger?.({
        path,
        status: error.upstreamStatus,
        attempt,
        durationMs: Date.now() - startedAt,
        outcome: "error",
        errorCode: error.code,
      });
      if (!error.retryable || attempt === MAX_ATTEMPTS) throw error;
      await sleepImpl(BASE_BACKOFF_MS * 2 ** (attempt - 1));
    }
  }

  // Uopnåeligt: løkken returnerer eller kaster på sidste forsøg.
  throw new UpstreamError();
}

function buildUrl(
  path: string,
  baseUrl: string,
  query?: Record<string, string | undefined>,
): string {
  const url = new URL(path, baseUrl);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  return url.toString();
}

/** Ét forsøg: request, status-oversættelse og JSON-parsing. */
async function attemptOnce<T>(
  url: string,
  config: MotorApiConfig,
): Promise<{ body: T; status: number }> {
  const {
    token,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    fetchImpl = fetch,
  } = config;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers: { "X-AUTH-TOKEN": token, Accept: "application/json" },
      signal: controller.signal,
    });

    const statusError = translateStatus(response.status);
    if (statusError) throw statusError;

    try {
      return { body: (await response.json()) as T, status: response.status };
    } catch {
      throw new InvalidResponseError("Kunne ikke læse svaret som JSON");
    }
  } finally {
    clearTimeout(timer);
  }
}

/** null betyder, at status er et succes-svar. */
function translateStatus(status: number): MotorApiError | null {
  if (status >= 200 && status < 300) return null;
  if (status === 404) return withUpstreamStatus(new NotFoundError(), status);
  if (status === 401 || status === 403)
    return withUpstreamStatus(new AuthError(), status);
  if (status === 429) return withUpstreamStatus(new RateLimitError(), status);
  if (status >= 500) return withUpstreamStatus(new UpstreamError(), status);
  // Øvrige 4xx betyder, at vores eget request var forkert. Gentagelse hjælper
  // ikke, så den markeres bevidst som ikke-gentagelig.
  return withUpstreamStatus(
    new UpstreamError(`MotorAPI svarede ${status}`, false),
    status,
  );
}

function withUpstreamStatus(error: MotorApiError, status: number) {
  error.upstreamStatus = status;
  return error;
}

function toMotorApiError(e: unknown): MotorApiError {
  if (e instanceof MotorApiError) return e;
  if (e instanceof Error && e.name === "AbortError") return new TimeoutError();
  return new NetworkError();
}
