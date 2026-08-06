// Typede fejl for MotorAPI-laget.
//
// Upstream-status oversættes ét sted (client.ts) til disse klasser, så resten
// af koden aldrig behøver kende til HTTP-koder. Route-handleren oversætter
// videre til vores eget ensartede fejlsvar. Rå upstream-tekst og -headers
// slipper aldrig ud til browseren.

export type MotorApiErrorCode =
  | "not_found"
  | "auth"
  | "rate_limit"
  | "upstream"
  | "timeout"
  | "network"
  | "invalid_input"
  | "invalid_response";

export class MotorApiError extends Error {
  readonly code: MotorApiErrorCode;
  /** HTTP-status vi selv svarer med. Ikke nødvendigvis upstream-status. */
  readonly status: number;
  /** Sandt hvis et nyt forsøg kan give et andet resultat. */
  readonly retryable: boolean;
  /** Upstream-status, hvis der kom et svar. Kun til serverside-log. */
  upstreamStatus?: number;

  constructor(
    code: MotorApiErrorCode,
    message: string,
    status: number,
    retryable = false,
  ) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

/** Nummerplade eller VIN findes ikke. Upstream 404. */
export class NotFoundError extends MotorApiError {
  constructor(message = "Køretøjet blev ikke fundet") {
    super("not_found", message, 404);
  }
}

/** Ugyldigt eller manglende X-AUTH-TOKEN. Upstream 401. */
export class AuthError extends MotorApiError {
  constructor(message = "MotorAPI afviste vores token") {
    super("auth", message, 502);
  }
}

/** Dagskvoten er opbrugt, eller upstream svarede 429. */
export class RateLimitError extends MotorApiError {
  constructor(message = "Dagskvoten hos MotorAPI er opbrugt") {
    super("rate_limit", message, 503);
  }
}

/** Upstream 5xx. Kan forsøges igen, medmindre andet angives. */
export class UpstreamError extends MotorApiError {
  constructor(message = "MotorAPI svarede med en fejl", retryable = true) {
    super("upstream", message, 502, retryable);
  }
}

/** Vores egen 10s-grænse blev overskredet. */
export class TimeoutError extends MotorApiError {
  constructor(message = "MotorAPI svarede ikke i tide") {
    super("timeout", message, 504, true);
  }
}

/** Netværket svigtede, før vi fik et svar. */
export class NetworkError extends MotorApiError {
  constructor(message = "Kunne ikke nå MotorAPI") {
    super("network", message, 502, true);
  }
}

/** Input blev afvist lokalt og kostede derfor ingen kvote. */
export class InvalidInputError extends MotorApiError {
  constructor(message = "Ugyldigt registreringsnummer") {
    super("invalid_input", message, 400);
  }
}

/** Svaret kom igennem, men matchede ikke det schema vi forventer. */
export class InvalidResponseError extends MotorApiError {
  constructor(message = "Uventet svar fra MotorAPI") {
    super("invalid_response", message, 502);
  }
}

export function isMotorApiError(e: unknown): e is MotorApiError {
  return e instanceof MotorApiError;
}
