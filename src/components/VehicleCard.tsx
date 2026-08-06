// Kortet der viser, hvad vi fandt på nummerpladen.
//
// Tre synlige tilstande: henter, fundet og ikke fundet.
//
// "unavailable" viser med vilje ingenting. Kunne vi ikke spørge — rate limit,
// timeout, eller intet serverlag — er det vores problem, ikke brugerens. At
// skrive "vi kunne ikke finde bilen" ville være forkert: vi har jo ikke kigget
// efter.
//
// Kortet ligger i en beholder, der folder sig ud i stedet for at springe frem.
// Uden den ville Navn, Email og knappen hoppe nedad to gange: én gang når
// "Henter…" dukker op, og én gang når den bliver til den færdige bil. Selve
// udfoldningen ligger i .bil-kort i index.css.
//
// De skjulte felter sender de hentede data med ved submit, sammen med
// nummerpladen og et tidsstempel for hvornår data blev hentet.

import { Info, Loader2 } from "lucide-react";

import { BrandBadge } from "@/components/BrandBadge";
import { cn } from "@/lib/utils";
import type { LookupState } from "@/lib/useVehicleLookup";

interface VehicleCardProps {
  state: LookupState;
}

/** "2024-10-30" → "oktober 2024". Dag og måned er for præcist til formålet. */
function formatDato(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})/);
  if (!match) return "";
  const maaneder = [
    "januar", "februar", "marts", "april", "maj", "juni",
    "juli", "august", "september", "oktober", "november", "december",
  ];
  const navn = maaneder[Number(match[2]) - 1];
  return navn ? `${navn} ${match[1]}` : match[1];
}

export function VehicleCard({ state }: VehicleCardProps) {
  const åben = state.status === "loading" || state.status === "found" ||
    state.status === "not_found";

  return (
    <div className={cn("bil-kort", åben && "is-open")}>
      <div>
        <Indhold state={state} />
      </div>
    </div>
  );
}

function Indhold({ state }: VehicleCardProps) {
  if (state.status === "loading") {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-trust/5 px-4 py-3.5">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-trust" />
        <p className="text-sm text-ink/70">Henter oplysninger om bilen …</p>
      </div>
    );
  }

  if (state.status === "not_found") {
    return (
      <div className="mt-3 rounded-xl bg-ink/[0.04] px-4 py-3.5">
        <p className="text-sm text-ink/70">
          Vi kunne ikke finde en bil med den nummerplade. Det gør ikke noget —
          udfyld selv oplysningerne herunder, så klarer vi resten.
        </p>
      </div>
    );
  }

  if (state.status !== "found" || !state.vehicle) return null;

  const {
    brand, model, variant, year, fuel, colour,
    mileage, mileageDate, hp, litres, nextInspection, isLeasing,
  } = state.vehicle;

  const overskrift = [brand, model].filter(Boolean).join(" ") || "Din bil";
  const detaljer = [variant, year ? String(year) : null, fuel, colour].filter(
    Boolean,
  ) as string[];

  // Nøgletal, brugeren genkender sin egen bil på. Kun dem vi rent faktisk
  // har — en manglende chip er bedre end en, der siger "ukendt".
  const nøgletal = [
    hp ? `${hp} hk` : null,
    litres ? `${litres.toLocaleString("da-DK")} liter` : null,
    mileage ? `${mileage.toLocaleString("da-DK")} km` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="mt-3 overflow-hidden rounded-xl bg-tp/5">
      <div className="flex items-start gap-3 p-4">
        <BrandBadge brand={brand} />
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight text-ink">{overskrift}</p>
          {detaljer.length > 0 && (
            <p className="mt-0.5 text-sm text-ink/65">{detaljer.join(" · ")}</p>
          )}

          {nøgletal.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {nøgletal.map((tal) => (
                <span
                  key={tal}
                  className="rounded-md bg-white/70 px-2 py-1 text-xs font-semibold text-ink/75"
                >
                  {tal}
                </span>
              ))}
            </div>
          )}

          {/* Kilometerstanden er aflæst ved synet og er altså historisk.
              Datoen står med, så tallet ikke forveksles med det nuværende. */}
          {(mileageDate || nextInspection) && (
            <p className="mt-2 text-xs text-ink/50">
              {mileageDate && `Km aflæst ved syn ${formatDato(mileageDate)}`}
              {mileageDate && nextInspection && " · "}
              {nextInspection && `Næste syn ${formatDato(nextInspection)}`}
            </p>
          )}

          <p className="mt-1.5 text-xs text-ink/45">
            Hentet fra Motorregistret. Ret gerne, hvis noget ikke passer.
          </p>
        </div>
      </div>

      {/* En leaset bil kan ejeren ikke uden videre sælge. Bedre at tage den
          samtale nu end efter der er givet et tilbud. */}
      {isLeasing && (
        <p className="flex items-start gap-2 border-t border-ink/[0.07] bg-white/50 px-4 py-2.5 text-xs text-ink/70">
          <Info className="mt-px h-3.5 w-3.5 shrink-0 text-ink/40" />
          <span>
            Bilen står registreret som leaset. Det klarer vi sammen med dig —
            nævn det gerne, når vi ringer.
          </span>
        </p>
      )}

      {/* Følger med ved submit, så oplysningerne når frem sammen med leadet. */}
      <input type="hidden" name="bil_maerke" value={brand ?? ""} />
      <input type="hidden" name="bil_model" value={model ?? ""} />
      <input type="hidden" name="bil_variant" value={variant ?? ""} />
      <input type="hidden" name="bil_aargang" value={year ?? ""} />
      <input type="hidden" name="bil_braendstof" value={fuel ?? ""} />
      <input type="hidden" name="bil_farve" value={colour ?? ""} />
      <input type="hidden" name="bil_nummerplade" value={state.plate ?? ""} />
      <input type="hidden" name="bil_hentet" value={state.fetchedAt ?? ""} />
      <input type="hidden" name="bil_vin" value={state.vehicle.vin ?? ""} />
      <input type="hidden" name="bil_status" value={state.vehicle.status ?? ""} />
      <input
        type="hidden"
        name="bil_foerste_reg"
        value={state.vehicle.firstRegistration ?? ""}
      />
      <input type="hidden" name="bil_km_ved_syn" value={mileage ?? ""} />
      <input type="hidden" name="bil_km_syn_dato" value={mileageDate ?? ""} />
      <input type="hidden" name="bil_hk" value={hp ?? ""} />
      <input type="hidden" name="bil_motor_liter" value={litres ?? ""} />
      <input type="hidden" name="bil_koeretoejstype" value={state.vehicle.type ?? ""} />
      <input type="hidden" name="bil_naeste_syn" value={nextInspection ?? ""} />
      <input type="hidden" name="bil_leasing" value={isLeasing ? "ja" : "nej"} />
    </div>
  );
}
