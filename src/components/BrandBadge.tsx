// Mærke-badge til bilkortet.
//
// OM RIGTIGE LOGOER: bilproducenters logoer er varemærker, og filerne er
// ophavsretligt beskyttede. At vise et VW-logo til en bruger, der selv ejer en
// VW, er i sig selv rimeligt nok — men at lægge logofilerne i et offentligt
// repo er en anden sag, og det er ikke en beslutning, koden skal tage på egen
// hånd.
//
// Derfor sættes mærket med typografi i stedet: et kendt kortnavn hvor der
// findes ét (VW, MB), ellers mærkets eget navn. Det virker for alle mærker,
// også dem vi aldrig har set før, og der opstår ingen huller, hvor et logo
// mangler.
//
// Skal der rigtige logoer på senere, er det kun denne fil, der skal ændres:
// erstat <span> med et <img>, og hold det udadtil ens.

/**
 * Kendte kortnavne. Kun mærker hvor navnet er for langt til badgen, og hvor
 * forkortelsen er indarbejdet nok til at blive genkendt. Er du i tvivl, så
 * lad være med at tilføje: "TOY" for Toyota hjælper ingen, og Toyota passer
 * fint som det er.
 */
const KORTNAVNE: Record<string, string> = {
  VOLKSWAGEN: "VW",
  "MERCEDES-BENZ": "MB",
  MERCEDES: "MB",
  "LAND ROVER": "LR",
  "ALFA ROMEO": "Alfa",
  "ŠKODA": "Škoda",
  SKODA: "Škoda",
};

/** Så meget tekst er der plads til i badgen, uden at den sprænges. */
const MAKS_TEGN = 8;

/**
 * Kort, læsbart mærkenavn til badgen.
 *
 * Badgen er dekoration: det fulde mærkenavn står alligevel i overskriften lige
 * ved siden af, og badgen er aria-hidden. Derfor er det i orden at forkorte
 * hårdt, når navnet ikke kan være der.
 */
export function brandLabel(brand: string): string {
  // Hårde mellemrum og dobbelte mellemrum forekommer i registerdata og ville
  // ellers få opslaget i tabellen til at ramme ved siden af.
  const key = brand.replace(/\s+/g, " ").trim().toUpperCase();

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
  const label = brand ? brandLabel(brand) : "Bil";

  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white px-1 text-ink shadow-sm ring-1 ring-black/5"
    >
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
    </span>
  );
}
