import { TrustpilotStar, TrustStars } from "@/components/icons";
import { SwipeRow } from "@/components/SwipeRow";

interface Review {
  title: string;
  text: string;
  initials: string;
  name: string;
  city: string;
  accent: "trust" | "brand";
}

// SWAP: rigtige kundeanmeldelser ind her
const REVIEWS: Review[] = [
  {
    title: "Fik 22.000 mere end forventet",
    text: "Jeg havde bud fra to forhandlere i forvejen — tilbuddet her lå markant højere. Pengene stod på kontoen, før de kørte med bilen.",
    initials: "MK",
    name: "Martin Kjær",
    city: "Aarhus",
    accent: "trust",
  },
  {
    title: "Nemt fra start til slut",
    text: "Skrev nummerpladen ind om formiddagen og havde et tilbud før frokost. Chaufføren var flink og professionel.",
    initials: "LN",
    name: "Louise Nielsen",
    city: "Odense",
    accent: "brand",
  },
  {
    title: "Skeptisk, men blev positivt overrasket",
    text: "Jeg var skeptisk over for at sælge til en opkøber, men prisen holdt præcis, hvad de lovede. Ingen overraskelser.",
    initials: "PA",
    name: "Peter Andersen",
    city: "Aalborg",
    accent: "trust",
  },
  {
    title: "Hurtig afhentning helt ude på landet",
    text: "Vi bor langt uden for Esbjerg og havde regnet med besvær. De kom hele vejen ud — uden ekstra omkostninger.",
    initials: "HT",
    name: "Hanne Thomsen",
    city: "Esbjerg",
    accent: "brand",
  },
  {
    title: "Solgte min varebil på en dag",
    text: "Havde en ældre Transporter stående efter firmalukning. Fair bud med det samme, og handlen var afsluttet på 24 timer.",
    initials: "SØ",
    name: "Søren Østergaard",
    city: "Vejle",
    accent: "trust",
  },
  {
    title: "God kommunikation hele vejen",
    text: "Jeg vidste altid, hvad der skete — sms både før og efter afhentning. Tryg oplevelse og en pris, jeg ikke fandt andre steder.",
    initials: "CB",
    name: "Camilla Bach",
    city: "København",
    accent: "brand",
  },
];

export function Reviews() {
  return (
    <section id="anmeldelser" className="bg-white py-10 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-5 flex flex-col items-center text-center sm:mb-12">
          {/* Kompakt Trustpilot-linje: logo, stjerner og score på én række
              (var tre stablede rækker og fyldte for meget på mobil) */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <TrustpilotStar className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-extrabold text-ink sm:text-xl">
                Trustpilot
              </span>
            </span>
            <TrustStars className="flex" />
            <span className="text-sm text-ink/70">
              <strong className="text-ink">4,8</strong> · 1.247 anmeldelser
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:mt-6 sm:text-4xl">
            Det siger vores sælgere
          </h2>
        </div>

        <SwipeRow count={REVIEWS.length}>
          {REVIEWS.map((r, i) => (
            <article
              key={r.name}
              className="swipe-card reveal flex flex-col rounded-2xl bg-offwhite p-5 shadow-soft sm:p-6"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <TrustStars className="mb-3 flex" />
              <h3 className="mb-2 font-bold text-ink">{r.title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{r.text}</p>
              <div className="mt-auto flex items-center gap-3 pt-4">
                <div
                  className={
                    r.accent === "trust"
                      ? "flex h-9 w-9 items-center justify-center rounded-full bg-trust/10 text-sm font-bold text-trust"
                      : "flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand"
                  }
                >
                  {r.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight text-ink">
                    {r.name}
                  </p>
                  <p className="text-xs text-ink/55">{r.city}</p>
                </div>
              </div>
            </article>
          ))}
        </SwipeRow>
      </div>
    </section>
  );
}
