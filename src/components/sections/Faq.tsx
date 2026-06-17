import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Hvorfor får jeg en bedre pris hos jer?",
    a: "Fordi vi eksporterer bilerne til markeder, hvor de er mere værd end i Danmark. Vores fortjeneste ligger i eksporten, og derfor kan vi tilbyde dig en højere pris end et almindeligt dansk videresalg.",
  },
  {
    q: "Hvor hurtigt får jeg et tilbud?",
    a: "Som regel inden for få timer på hverdage. Du indtaster din nummerplade og dine kontaktoplysninger, og så vender vi tilbage med et konkret tilbud hurtigst muligt.",
  },
  {
    q: "Koster afhentning noget?",
    a: "Nej. Afhentning er gratis i hele Danmark, uanset om bilen står i en storby eller langt ude på landet. Der er ingen skjulte gebyrer.",
  },
  {
    q: "Hvordan får jeg pengene?",
    a: "Pengene overføres direkte til din bankkonto, typisk samme dag som vi henter bilen. Du modtager hele det aftalte beløb uden fradrag.",
  },
  {
    q: "Hvilke biler køber I?",
    a: "Vi køber både person- og varebiler af stort set alle mærker, årgange og kilometerstande. Også biler med fejl, høj kilometerstand eller manglende syn er velkomne. Indtast din nummerplade, så vurderer vi den.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Ofte stillede spørgsmål
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={cn(
                  "faq-item reveal overflow-hidden rounded-2xl bg-offwhite",
                  isOpen && "open",
                )}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <button
                  className="faq-trigger flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i + 1}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="font-bold text-ink">{faq.q}</span>
                  <Plus
                    className="faq-icon h-5 w-5 shrink-0 text-brand"
                    strokeWidth={2.2}
                  />
                </button>
                <div
                  id={`faq-panel-${i + 1}`}
                  className="faq-panel"
                  role="region"
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink/70">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
