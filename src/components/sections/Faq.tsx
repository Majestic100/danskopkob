import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Hvorfor får jeg en bedre pris hos jer?",
    a: "Fordi vi eksporterer bilerne til markeder, hvor de er mere værd end i Danmark. Fortjenesten ligger i eksporten, så vi kan byde højere end et almindeligt dansk videresalg.",
  },
  {
    q: "Hvor hurtigt får jeg et tilbud?",
    a: "Som regel inden for få timer på hverdage.",
  },
  {
    q: "Koster afhentning noget?",
    a: "Nej. Afhentning er gratis i hele Danmark, og der er ingen skjulte gebyrer.",
  },
  {
    q: "Hvordan får jeg pengene?",
    a: "Som straksoverførsel til din bankkonto. Beløbet står på kontoen, før vi kører med bilen, og du får hele det aftalte beløb uden fradrag.",
  },
  {
    q: "Hvilke biler køber I?",
    a: "Både person- og varebiler af stort set alle mærker og årgange. Biler med fejl, høj kilometerstand eller manglende syn er også velkomne.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
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
