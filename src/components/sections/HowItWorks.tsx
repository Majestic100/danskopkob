import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Check, ShieldCheck, type LucideIcon } from "lucide-react";

interface Step {
  n: string;
  ChipIcon: LucideIcon;
  title: string;
  desc: string;
  chip: string;
  chipValue?: string;
}

// Følger ét konkret eksempel-forløb (VW Passat fra Aarhus) gennem trinnene.
// Tidsstemplerne viser hele vejen fra udfyldt formular til betalt og afhentet.
const STEPS: Step[] = [
  {
    n: "01",
    ChipIcon: Clock,
    title: "Indtast nummerplade",
    desc: "Udfyld formularen med nummerplade og kontaktoplysninger. Det tager under et minut.",
    chip: "Kl. 09:14 · formular udfyldt på 40 sek.",
  },
  {
    n: "02",
    ChipIcon: Clock,
    title: "Få et tilbud",
    desc: "Vi vurderer bilen og ringer dig op med et konkret tilbud, typisk inden for få timer.",
    chip: "Kl. 11:02 · tilbud",
    chipValue: "131.000 kr",
  },
  {
    n: "03",
    ChipIcon: Check,
    title: "Betaling og afhentning",
    desc: "Siger du ja, sender vi pengene som straksoverførsel. Beløbet står på din konto, før vi kører med bilen.",
    chip: "Næste dag kl. 10:20 · betalt og afhentet ·",
    chipValue: "131.000 kr",
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
            Fra udfyldt formular til penge på kontoen, ofte på under et døgn.
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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-4">
          {STEPS.map((step, i) => {
            const { ChipIcon } = step;
            return (
              <Fragment key={step.n}>
                <div
                  className="reveal relative flex-1 rounded-2xl border border-black/5 bg-offwhite p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-softlg sm:p-7"
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <span className="absolute right-5 top-4 text-5xl font-extrabold text-black/5">
                    {step.n}
                  </span>
                  <h3 className="mb-2 max-w-[85%] text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink/70">{step.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink/70">
                    <ChipIcon
                      className="h-3.5 w-3.5 shrink-0 text-ink/50"
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

        <div className="reveal mt-10 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-tp/10 px-4 py-2 text-sm font-semibold text-tp">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
            Pengene står på din konto, før vi kører
          </span>
          <Link
            to="/saelg-din-bil"
            className="btn-cta inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 font-bold text-white shadow-soft"
          >
            Start med din nummerplade
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
