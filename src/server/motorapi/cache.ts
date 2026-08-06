// TTL-cache med deduplikering af samtidige identiske kald.
//
// To adskilte formål, som er nemme at blande sammen:
//
//   Cache          gemmer et færdigt svar, så det næste kald med samme nøgle
//                  slipper for at ringe ud. Køretøjsdata ændrer sig sjældent,
//                  så TTL er ~24 timer.
//   Deduplikering  sørger for, at to samtidige kald med samme nøgle deler ét
//                  udgående request i stedet for at bruge to af dagskvoten.
//                  Uden det ville debounce i browseren stadig kunne udløse
//                  parallelle opslag fra to faner på samme plade.
//
// Lageret er en Map i hukommelsen og lever derfor kun så længe serverinstansen
// gør. På Workers og serverless genbruges instansen mellem requests, men den
// kan forsvinde når som helst. Cachen er en besparelse, ikke en garanti.

interface Entry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheOptions {
  /** Levetid i millisekunder. */
  ttlMs: number;
  /** Injicerbar tid, så tests kan spole frem uden at vente. */
  now?: () => number;
  /** Loft over antal poster, så en instans med lang levetid ikke vokser frit. */
  maxEntries?: number;
}

export class TtlCache<T> {
  private readonly entries = new Map<string, Entry<T>>();
  private readonly inFlight = new Map<string, Promise<T>>();
  private readonly ttlMs: number;
  private readonly now: () => number;
  private readonly maxEntries: number;

  constructor({ ttlMs, now = Date.now, maxEntries = 500 }: CacheOptions) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.maxEntries = maxEntries;
  }

  get(key: string): T | undefined {
    const hit = this.entries.get(key);
    if (!hit) return undefined;
    if (hit.expiresAt <= this.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: T): void {
    // Ældste post ryger først, når loftet er nået. Map bevarer indsættelses-
    // rækkefølgen, så den første nøgle er også den ældste.
    if (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next();
      if (!oldest.done) this.entries.delete(oldest.value);
    }
    this.entries.set(key, { value, expiresAt: this.now() + this.ttlMs });
  }

  /**
   * Returnér cachet værdi, ellers kald `produce`. Kaldes den samme nøgle igen,
   * mens det første kald stadig er undervejs, får begge samme løfte.
   *
   * Fejl caches ikke: slår et opslag fejl, skal det næste have lov at prøve.
   */
  async fetch(key: string, produce: () => Promise<T>): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) return cached;

    const pending = this.inFlight.get(key);
    if (pending) return pending;

    const promise = produce()
      .then((value) => {
        this.set(key, value);
        return value;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  /** Kun til brug i tests. */
  clear(): void {
    this.entries.clear();
    this.inFlight.clear();
  }

  get size(): number {
    return this.entries.size;
  }
}
