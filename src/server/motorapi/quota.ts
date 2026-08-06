// Kvote-guard.
//
// MotorAPI har en dagskvote, og /usage er gratis og tæller ikke med. Alligevel
// kaldes det ikke per request: så ville hvert opslag koste to rundture. I
// stedet caches svaret i 5 minutter, og forbruget tælles lokalt op imellem
// opdateringerne.
//
// Reserven gør, at vi stopper lidt før nul. Uden den ville det sidste kald på
// dagen blive brugt af en tilfældig besøgende, i stedet for at være til
// rådighed, hvis noget vigtigt skal slås op.

import { motorApiRequest, type MotorApiConfig } from "./client";
import { UsageSchema, type Usage } from "./schemas";
import { InvalidResponseError, RateLimitError } from "./errors";

const USAGE_TTL_MS = 5 * 60 * 1000;
export const DEFAULT_RESERVE = 5;

interface CachedUsage {
  usage: Usage;
  fetchedAt: number;
  /** Kald foretaget efter at usage blev hentet. Nulstilles ved opdatering. */
  spentSince: number;
}

export class QuotaGuard {
  private cached: CachedUsage | null = null;
  private inFlight: Promise<Usage> | null = null;

  constructor(
    private readonly config: MotorApiConfig,
    private readonly reserve = DEFAULT_RESERVE,
    private readonly now: () => number = Date.now,
    private readonly ttlMs = USAGE_TTL_MS,
  ) {}

  /**
   * Kaster RateLimitError, hvis der ikke er kvote nok tilbage. Kan ikke
   * kvoten aflæses, får opslaget lov at fortsætte: en fejl i /usage må ikke
   * tage nummerplade-opslaget ned, og upstream svarer selv 429, hvis grænsen
   * rent faktisk er nået.
   */
  async assertHasQuota(): Promise<void> {
    let usage: Usage;
    try {
      usage = await this.getUsage();
    } catch (e) {
      if (e instanceof RateLimitError) throw e;
      return;
    }

    const spent = this.cached?.spentSince ?? 0;
    const remaining = usage.today.remaining - spent;
    if (remaining <= this.reserve) throw new RateLimitError();
  }

  /** Kaldes efter hvert kald, der reelt gik ud af huset. */
  recordSpend(count = 1): void {
    if (this.cached) this.cached.spentSince += count;
  }

  private async getUsage(): Promise<Usage> {
    const cached = this.cached;
    if (cached && this.now() - cached.fetchedAt < this.ttlMs) {
      return cached.usage;
    }
    // Deduplikering: flere samtidige requests deler ét /usage-kald.
    if (this.inFlight) return this.inFlight;

    this.inFlight = (async () => {
      const raw = await motorApiRequest<unknown>("/usage", this.config);
      const parsed = UsageSchema.safeParse(raw);
      if (!parsed.success) {
        throw new InvalidResponseError("Uventet svar fra /usage");
      }
      this.cached = {
        usage: parsed.data,
        fetchedAt: this.now(),
        spentSince: 0,
      };
      return parsed.data;
    })().finally(() => {
      this.inFlight = null;
    });

    return this.inFlight;
  }

  /** Kun til brug i tests. */
  reset(): void {
    this.cached = null;
    this.inFlight = null;
  }
}
