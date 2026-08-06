// Kortet der viser, hvad vi fandt på nummerpladen.
//
// Tre synlige tilstande: henter, fundet og ikke fundet.
//
// "unavailable" viser med vilje ingenting. Kunne vi ikke spørge — rate limit,
// timeout, eller intet serverlag deployet endnu — er det vores problem, ikke
// brugerens. At skrive "vi kunne ikke finde bilen" i det tilfælde ville være
// forkert: vi har jo ikke kigget efter. Så længe sitet ligger på GitHub Pages
// uden serverlag, er det den tilstand alle opslag ender i, og formularen ser
// derfor ud præcis som før.
//
// De skjulte felter sender de hentede data med ved submit, sammen med
// nummerpladen og et tidsstempel for hvornår data blev hentet.

import { Car, Loader2 } from "lucide-react";

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
  if (state.status === "idle" || state.status === "unavailable") return null;

  if (state.status === "loading") {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-trust/5 px-4 py-3.5">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-trust" />
        <p className="text-sm text-ink/70">Henter oplysninger om bilen …</p>
      </div>
    );
  }

  // Herfra er vi enten "found" eller "not_found": serveren har svaret.
  if (state.status !== "found" || !state.vehicle) {
    return (
      <div className="mt-3 rounded-xl bg-ink/[0.04] px-4 py-3.5">
        <p className="text-sm text-ink/70">
          Vi kunne ikke finde en bil med den nummerplade. Det gør ikke noget —
          udfyld selv oplysningerne herunder, så klarer vi resten.
        </p>
      </div>
    );
  }

  const { brand, model, variant, year, fuel, colour, mileage, mileageDate } =
    state.vehicle;
  const overskrift = [brand, model].filter(Boolean).join(" ") || "Din bil";
  const detaljer = [variant, year ? String(year) : null, fuel, colour].filter(
    Boolean,
  ) as string[];

  return (
    <div className="mt-3 rounded-xl bg-tp/[0.07] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
          <Car className="h-5 w-5 text-tp" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="font-bold leading-tight text-ink">{overskrift}</p>
          {detaljer.length > 0 && (
            <p className="mt-0.5 text-sm text-ink/65">{detaljer.join(" · ")}</p>
          )}
          {/* Kilometerstanden er aflæst ved synet og er altså historisk.
              Datoen står med, så tallet ikke forveksles med det nuværende. */}
          {mileage && (
            <p className="mt-0.5 text-sm text-ink/65">
              {mileage.toLocaleString("da-DK")} km ved sidste syn
              {mileageDate ? ` ${formatDato(mileageDate)}` : ""}
            </p>
          )}
          <p className="mt-1.5 text-xs text-ink/45">
            Hentet fra Motorregistret. Ret gerne, hvis noget ikke passer.
          </p>
        </div>
      </div>

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
    </div>
  );
}
