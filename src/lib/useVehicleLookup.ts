// Nummerplade-opslag fra browseren.
//
// Regler, der styrer hvornår der overhovedet slås op:
//   1. Aldrig per tastetryk. Der ventes 500 ms efter sidste tast.
//   2. Kun når input matcher et gyldigt dansk mønster. "AB1" koster ikke kvote.
//   3. Samme plade slås ikke op to gange; svaret huskes i sessionen.
//
// Og den vigtigste regel: opslaget må aldrig kunne blokere en indsendelse.
// Alt herunder er additivt. Fejler det, sker der ingenting andet end at kortet
// udebliver, og brugeren udfylder selv.

import { useCallback, useEffect, useRef, useState } from "react";

import { isLookupable, normalizePlate } from "@/lib/plate";

const DEBOUNCE_MS = 500;
/** Klienten giver op før serverens egen grænse, så UI'et ikke hænger. */
const CLIENT_TIMEOUT_MS = 12_000;

export interface VehicleSummary {
  brand?: string;
  model?: string;
  variant?: string;
  year?: number;
  fuel?: string;
  colour?: string;
  raw?: Record<string, unknown>;
}

export type LookupStatus = "idle" | "loading" | "found" | "not_found" | "error";

export interface LookupState {
  status: LookupStatus;
  vehicle: VehicleSummary | null;
  /** Pladen svaret hører til, så et forældet svar kan kasseres. */
  plate: string | null;
  /** ISO-tidspunkt for hvornår data blev hentet. Følger med i formularen. */
  fetchedAt: string | null;
}

const IDLE: LookupState = {
  status: "idle",
  vehicle: null,
  plate: null,
  fetchedAt: null,
};

/**
 * Slår op på `input`, når det er stabilt og gyldigt.
 *
 * Returnerer altid en tilstand, aldrig en fejl der kan kastes videre. Kaldere
 * skal kunne ignorere resultatet fuldstændigt.
 */
export function useVehicleLookup(input: string): LookupState {
  const [state, setState] = useState<LookupState>(IDLE);

  // Svar huskes for hele sessionen: retter brugeren pladen frem og tilbage,
  // koster det ikke et nyt kald.
  const cache = useRef(new Map<string, LookupState>());
  const abortRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (plate: string) => {
    const cached = cache.current.get(plate);
    if (cached) {
      setState(cached);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    setState({ status: "loading", vehicle: null, plate, fetchedAt: null });

    try {
      const response = await fetch(
        `/api/vehicle/${encodeURIComponent(plate)}`,
        { signal: controller.signal, headers: { Accept: "application/json" } },
      );

      // Alt andet end 200 behandles ens: intet kort, manuel udfyldning.
      // Årsagen ligger i serverloggen, ikke i brugerens ansigt.
      if (!response.ok) {
        const next: LookupState = {
          status: response.status === 400 ? "not_found" : "error",
          vehicle: null,
          plate,
          fetchedAt: null,
        };
        setState(next);
        return;
      }

      const body = (await response.json()) as {
        found?: boolean;
        vehicle?: VehicleSummary | null;
        fetchedAt?: string;
      };

      const next: LookupState =
        body.found && body.vehicle
          ? {
              status: "found",
              vehicle: body.vehicle,
              plate,
              fetchedAt: body.fetchedAt ?? new Date().toISOString(),
            }
          : { status: "not_found", vehicle: null, plate, fetchedAt: null };

      cache.current.set(plate, next);
      setState(next);
    } catch {
      // Timeout, netværksfejl, eller siden findes ikke (fx statisk hosting
      // uden serverlag). Alle ender samme sted: manuel udfyldning.
      setState({ status: "error", vehicle: null, plate, fetchedAt: null });
    } finally {
      clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const plate = normalizePlate(input);

    if (!isLookupable(plate)) {
      abortRef.current?.abort();
      setState(IDLE);
      return;
    }

    const timer = setTimeout(() => void lookup(plate), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input, lookup]);

  // Ryd op, hvis komponenten forsvinder midt i et opslag.
  useEffect(() => () => abortRef.current?.abort(), []);

  return state;
}
