import { Fragment } from "react";
import {
  Car,
  MessageSquare,
  Truck,
  Banknote,
  ArrowRight,
  Clock,
  MapPin,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT = {
  brand: { bg: "bg-brand/10", text: "text-brand" },
  trust: { bg: "bg-trust/10", text: "text-trust" },
  tp: { bg: "bg-tp/10", text: "text-tp" },
} as const;

type Accent = keyof typeof ACCENT;

interface Step {
  n: string;
  Icon: LucideIcon;
  ChipIcon: LucideIcon;
  accent: Accent;
  title: string;
  desc: string;
  chip: string;
  chipValue?: string;
}

// Følger ét konkret eksempel-forløb (VW Passat fra Aarhus) gennem trinnene.
const STEPS: Step[] = [
  {
    n: "01",
    Icon: Car,
    ChipIcon: Clock,
    accent: "brand",
    title: "Indtast nummerplade",
    desc: "Skriv din nummerplade, så går vi straks i gang. Det tager under et minut.",
    chip: "Kl. 09:14 · tog 40 sekunder",
  },
  {
    n: "02",
    Icon: MessageSquare,
    ChipIcon: Clock,
    accent: "trust",
    title: "Få et tilbud",
    desc: "Vi vurderer bilen og sender dig et konkret tilbud inden for få timer.",
    chip: "Kl. 11:02 · tilbud",
    chipValue: "131.000 kr",
  },
  {
    n: "03",
    Icon: Truck,
    ChipIcon: MapPin,
    accent: "brand",
    title: "Vi afhenter gratis",
    desc: "Uanset hvor i landet bilen står, henter vi den uden beregning.",
    chip: "Næste dag · afhentet i Aarhus",
  },
  {
    n: "04",
    Icon: Banknote,
    ChipIcon: Check,
    accent: "tp",
    title: "Du får pengene",
    desc: "Beløbet overføres til din konto, typisk samme dag som afhentningen.",
    chip: "Samme dag ·",
    chipValue: "131.000 kr på kontoen",
  },
];

export function HowItWorks() {
  return (
    <section id="saadan-virker-det" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto mb-4 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            Nemt og hurtigt
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Sådan fungerer det
          </h2>
          <p className="mt-4 text-ink/70">
            Følg et typisk forløb — fra nummerplade til penge på kontoen, ofte
            på under et døgn.
          </p>
        </div>

        {/* Lille eksempel-mærkat (ærligt: det er et eksempel) */}
        <div className="reveal mb-12 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-1.5 text-xs font-medium text-ink/60">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Et typisk forløb · eksempel: VW Passat fra Aarhus
          </span>
        </div>

        {/* Rejse: trin forbundet med pile */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-3">
          {STEPS.map((step, i) => {
            const { Icon, ChipIcon } = step;
            return (
              <Fragment key={step.n}>
                <div
                  className="reveal relative flex-1 rounded-2xl border border-black/5 bg-offwhite p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-softlg"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span className="absolute right-5 top-4 text-5xl font-extrabold text-black/5">
                    {step.n}
                  </span>
                  <div
                    className={cn(
                      "mb-5 flex h-12 w-12 items-center justify-center rounded-xl",
                      ACCENT[step.accent].bg,
                    )}
                  >
                    <Icon className={cn("h-6 w-6", ACCENT[step.accent].text)} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink/70">{step.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink/70">
                    <ChipIcon
                      className="h-3.5 w-3.5 text-ink/50"
                      strokeWidth={2.2}
                    />
                    <span>
                      {step.chip}
                      {step.chipValue && (
                        <span className="font-bold text-tp">
                          {" "}
                          {step.chipValue}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="hidden items-center justify-center lg:flex">
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-ink/25"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        <div className="reveal mt-12 text-center">
          <a
            href="#tilbud"
            className="btn-cta inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-bold text-white shadow-soft"
          >
            Start med din nummerplade
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
