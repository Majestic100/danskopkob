import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { TrustpilotStar, TrustStars } from "@/components/icons";

// Samme anmeldelser som i Trustpilot-sektionen (+ et par ekstra), her som
// rullende bånd. SWAP: rigtige kundeanmeldelser ind her.
const TESTIMONIALS = [
  {
    author: { name: "Martin Kjær", handle: "Aarhus · Verificeret" },
    title: "Fik 22.000 mere end forventet",
    text: "Jeg havde fået bud fra to forhandlere i forvejen, men tilbuddet her var markant højere. Bilen blev hentet to dage efter, og pengene stod på kontoen samme aften.",
  },
  {
    author: { name: "Louise Nielsen", handle: "Odense · Verificeret" },
    title: "Nemt fra start til slut",
    text: "Skrev nummerpladen ind om formiddagen og havde et tilbud før frokost. Alt foregik gnidningsfrit, og chaufføren der hentede bilen var flink og professionel.",
  },
  {
    author: { name: "Peter Andersen", handle: "Aalborg · Verificeret" },
    title: "Skeptisk, men blev positivt overrasket",
    text: "Jeg var lidt skeptisk over for at sælge til en eksportør, men det viste sig at være den bedste beslutning. Prisen holdt det de lovede. Ingen overraskelser.",
  },
  {
    author: { name: "Hanne Thomsen", handle: "Esbjerg · Verificeret" },
    title: "Hurtig afhentning helt ude på landet",
    text: "Vi bor et godt stykke uden for Esbjerg og havde regnet med besvær. Men de kom hele vejen ud uden ekstra omkostninger. Super service.",
  },
  {
    author: { name: "Søren Østergaard", handle: "Vejle · Verificeret" },
    title: "Solgte min varebil på en dag",
    text: "Havde en ældre Transporter stående efter jeg lukkede mit firma. De gav et fair bud med det samme, og hele handlen var afsluttet inden for 24 timer.",
  },
  {
    author: { name: "Camilla Bach", handle: "København · Verificeret" },
    title: "God kommunikation hele vejen",
    text: "Jeg vidste altid hvad der skete — besked på sms både før og efter afhentning. Tryg oplevelse, og en pris jeg ikke kunne finde andre steder.",
  },
  {
    author: { name: "Jonas Lind", handle: "Randers · Verificeret" },
    title: "Restgælden var intet problem",
    text: "Min bil havde stadig lån i sig, og jeg troede det ville blokere salget. De indfriede restgælden direkte med banken og udbetalte resten til mig samme dag.",
  },
  {
    author: { name: "Mette Sørensen", handle: "Roskilde · Verificeret" },
    title: "Bedste pris af fire tilbud",
    text: "Jeg indhentede tilbud fire steder, inkl. to bilbasen-opkøbere. Tilbuddet her lå øverst, og der kom ikke fradrag oveni ved afhentning, som jeg havde frygtet.",
  },
];

export function TestimonialsMarquee() {
  return (
    <TestimonialsSection
      badge={
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft ring-1 ring-black/5">
          <TrustpilotStar className="h-5 w-5" />
          <span className="text-sm font-extrabold text-ink">Trustpilot</span>
          <TrustStars className="flex" />
        </span>
      }
      title={
        <>
          Danskerne har talt:{" "}
          <span className="text-brand">4,8 ud af 5</span> stjerner
        </>
      }
      description="Ærlige ord fra rigtige sælgere — fra Esbjerg til København."
      stats={
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { value: "4,8/5", label: "Gennemsnit på Trustpilot" },
            { value: "1.247", label: "Verificerede anmeldelser" },
            { value: "9/10", label: "Vil anbefale os til andre" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-ink">
                {stat.value}
              </span>
              <span className="text-sm text-ink/55">{stat.label}</span>
            </div>
          ))}
        </div>
      }
      testimonials={TESTIMONIALS}
    />
  );
}
