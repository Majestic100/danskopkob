// Mærke-badge til bilkortet.
//
// Mærkets rigtige logo, hvor filen findes: logoerne ligger i public/logos/ og
// bruges allerede i mærke-striben på forsiden, så bilkortet trækker på samme
// filer. For mærker uden fil — og hvis en fil falder fra (404) — sættes mærket
// med typografi i stedet: et kendt kortnavn hvor der findes ét (VW, MB),
// ellers mærkets eget navn. Badgen ser dermed aldrig brudt ud, heller ikke for
// mærker vi aldrig har set før.

import { useState } from "react";

/**
 * Mærke → logofil under public/. Samme filer som mærke-striben i
 * ui/logos3.tsx bruger; nye filer lægges i public/logos/ (se README der).
 * Nøglerne er normaliserede med `nøgle()`: VERSALER, enkelte mellemrum.
 */
const LOGOFILER: Record<string, string> = {
  VOLKSWAGEN: "logos/vw.webp",
  VW: "logos/vw.webp",
  AUDI: "logos/audi.svg",
  BMW: "logos/bmw.png",
  "MERCEDES-BENZ": "logos/mercedes.svg",
  MERCEDES: "logos/mercedes.svg",
  ŠKODA: "logos/skoda.png",
  SKODA: "logos/skoda.png",
  TOYOTA: "logos/toyota.webp",
  KIA: "logos/kia.svg",
  FORD: "logos/ford.png",
  VOLVO: "logos/volvo.png",
  PEUGEOT: "logos/peugeot.png",
  RENAULT: "logos/renault.svg",
  HYUNDAI: "logos/hyundai.png",
  OPEL: "logos/opel.png",
  TESLA: "logos/tesla.png",
};

/**
 * Kendte kortnavne til tekst-reserven. Kun mærker hvor navnet er for langt til
 * badgen, og hvor forkortelsen er indarbejdet nok til at blive genkendt. Er du
 * i tvivl, så lad være med at tilføje: "TOY" for Toyota hjælper ingen, og
 * Toyota passer fint som det er.
 */
const KORTNAVNE: Record<string, string> = {
  VOLKSWAGEN: "VW",
  "MERCEDES-BENZ": "MB",
  MERCEDES: "MB",
  "LAND ROVER": "LR",
  "ALFA ROMEO": "Alfa",
  ŠKODA: "Škoda",
  SKODA: "Škoda",
};

/** Så meget tekst er der plads til i badgen, uden at den sprænges. */
const MAKS_TEGN = 8;

/**
 * Normaliseret opslagsnøgle. Hårde mellemrum og dobbelte mellemrum forekommer
 * i registerdata og ville ellers få opslaget i tabellerne til at ramme ved
 * siden af.
 */
function nøgle(brand: string): string {
  return brand.replace(/\s+/g, " ").trim().toUpperCase();
}

/** Logofilen for et mærke, eller undefined når vi ikke har en. */
export function brandLogo(brand: string): string | undefined {
  return LOGOFILER[nøgle(brand)];
}

/**
 * Kort, læsbart mærkenavn til tekst-reserven.
 *
 * Badgen er dekoration: det fulde mærkenavn står alligevel i overskriften lige
 * ved siden af, og badgen er aria-hidden. Derfor er det i orden at forkorte
 * hårdt, når navnet ikke kan være der.
 */
export function brandLabel(brand: string): string {
  const key = nøgle(brand);

  const kendt = KORTNAVNE[key];
  if (kendt) return kendt;

  // Tre bogstaver eller derunder er som regel netop en forkortelse — BMW,
  // KIA, MG, DS — og skal blive stående, som den er.
  if (key.length <= 3) return key;

  // Resten sættes med stort begyndelsesbogstav. VERSALER hele vejen ser ud,
  // som om data råber ad brugeren.
  const pænt = key.charAt(0) + key.slice(1).toLowerCase();
  if (pænt.length <= MAKS_TEGN) return pænt;

  // Sidste udvej for et navn, vi hverken kender eller kan vise: forbogstaver.
  return key
    .split(" ")
    .map((ord) => ord.charAt(0))
    .join("")
    .slice(0, 3);
}

interface BrandBadgeProps {
  brand?: string;
}

export function BrandBadge({ brand }: BrandBadgeProps) {
  // Husker hvilken fil der fejlede, ikke bare at én gjorde. Slår brugeren en
  // ny plade op med et andet mærke, skal det mærkes logo have sin chance.
  const [fejletLogo, setFejletLogo] = useState<string | null>(null);

  const logo = brand ? brandLogo(brand) : undefined;
  const visLogo = Boolean(logo) && logo !== fejletLogo;
  const label = brand ? brandLabel(brand) : "Bil";

  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 text-ink shadow-sm ring-1 ring-black/5"
    >
      {visLogo ? (
        <img
          src={`${import.meta.env.BASE_URL}${logo}`}
          alt=""
          decoding="async"
          onError={() => setFejletLogo(logo ?? null)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          className={
            // Lange navne skal kunne være der uden at sprænge feltet.
            label.length > 4
              ? "text-[10px] font-extrabold uppercase leading-none tracking-tight"
              : "text-sm font-extrabold uppercase leading-none tracking-tight"
          }
        >
          {label}
        </span>
      )}
    </span>
  );
}
