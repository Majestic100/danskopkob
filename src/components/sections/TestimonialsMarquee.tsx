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
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <TrustpilotStar className="h-6 w-6" />
            <span className="text-lg font-extrabold text-ink">Trustpilot</span>
          </div>
          <div className="flex items-center gap-3">
            <TrustStars className="flex" />
            <span className="text-sm text-ink/70">
              <strong className="text-ink">Fremragende</strong> · 4,8 ud af 5
              · 1.247 anmeldelser
            </span>
          </div>
        </div>
      }
      title="Danskere i hele landet har allerede solgt til os"
      description="Ærlige ord fra rigtige sælgere — fra Esbjerg til København. Båndet kører selv; hold musen over for at læse i ro og mag."
      testimonials={TESTIMONIALS}
    />
  );
}
