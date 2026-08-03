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
    text: "Jeg havde fået bud fra to forhandlere i forvejen, men tilbuddet her var markant højere. Bilen blev hentet to dage efter, og pengene stod på kontoen, før de kørte. Kan klart anbefales.",
    initials: "MK",
    name: "Martin Kjær",
    city: "Aarhus",
    accent: "trust",
  },
  {
    title: "Nemt fra start til slut",
    text: "Skrev nummerpladen ind om formiddagen og havde et tilbud før frokost. Alt foregik gnidningsfrit, og chaufføren der hentede bilen var flink og professionel.",
    initials: "LN",
    name: "Louise Nielsen",
    city: "Odense",
    accent: "brand",
  },
  {
    title: "Skeptisk, men blev positivt overrasket",
    text: "Jeg var lidt skeptisk over for at sælge til en opkøber, men det viste sig at være den bedste beslutning. De var ærlige om processen hele vejen, og prisen holdt det de lovede. Ingen overraskelser.",
    initials: "PA",
    name: "Peter Andersen",
    city: "Aalborg",
    accent: "trust",
  },
  {
    title: "Hurtig afhentning helt ude på landet",
    text: "Vi bor et godt stykke uden for Esbjerg og havde regnet med besvær. Men de kom hele vejen ud uden ekstra omkostninger. Super service.",
    initials: "HT",
    name: "Hanne Thomsen",
    city: "Esbjerg",
    accent: "brand",
  },
  {
    title: "Solgte min varebil på en dag",
    text: "Havde en ældre Transporter stående efter jeg lukkede mit firma. De gav et fair bud med det samme, og hele handlen var afsluttet inden for 24 timer. Anbefales til andre håndværkere.",
    initials: "SØ",
    name: "Søren Østergaard",
    city: "Vejle",
    accent: "trust",
  },
  {
    title: "God kommunikation hele vejen",
    text: "Det jeg satte mest pris på var, at jeg altid vidste hvad der skete. Jeg fik besked på sms både før og efter afhentning. Tryg oplevelse, og en pris jeg ikke kunne finde andre steder.",
    initials: "CB",
    name: "Camilla Bach",
    city: "København",
    accent: "brand",
  },
];

export function Reviews() {
  return (
    <section id="anmeldelser" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-8 flex flex-col items-center text-center sm:mb-12">
          {/* Trustpilot-logo (inline SVG) + score */}
          <div className="mb-3 flex items-center gap-2">
            <TrustpilotStar className="h-6 w-6" />
            <span className="text-xl font-extrabold text-ink">Trustpilot</span>
          </div>
          <div className="flex items-center gap-3">
            <TrustStars size="lg" className="flex" />
            <span className="text-sm text-ink/70">
              <strong className="text-ink">4,8</strong> ud af 5 · 1.247
              anmeldelser
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Det siger vores sælgere
          </h2>
        </div>

        <SwipeRow count={REVIEWS.length}>
          {REVIEWS.map((r, i) => (
            <article
              key={r.name}
              className="swipe-card reveal flex flex-col rounded-2xl bg-offwhite p-6 shadow-soft"
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              <TrustStars className="mb-4 flex" />
              <h3 className="mb-2 font-bold text-ink">{r.title}</h3>
              <p className="text-sm leading-relaxed text-ink/70">{r.text}</p>
              <div className="mt-auto flex items-center gap-3 pt-5">
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
