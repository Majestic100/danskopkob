import { ArrowRight } from "lucide-react";
import { DanishFlag } from "@/components/icons";
import { DenmarkMap } from "@/components/DenmarkMap";

const CITIES = ["København", "Aarhus", "Odense", "Aalborg", "Esbjerg"];

export function Coverage() {
  return (
    <section className="bg-[#15151a] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Tekst */}
          <div className="reveal">
            <div className="mb-4 flex items-center gap-2">
              <DanishFlag className="w-7 h-5 rounded-sm" />
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-trust">
                Hele landet
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Vi henter din bil gratis, uanset hvor du bor
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Fra Skagen til Gedser. Vi dækker hele Danmark, og afhentningen
              koster aldrig noget. Vores chauffører kører ud til både byer og
              landområder.
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-3">
              {CITIES.map((city) => (
                <li
                  key={city}
                  className="flex items-center gap-2 text-sm font-semibold text-white"
                >
                  <span className="h-2 w-2 rounded-full bg-brand" /> {city}
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm font-semibold text-white/60">
                <span className="h-2 w-2 rounded-full bg-trust" /> og alt
                derimellem
              </li>
            </ul>

            <a
              href="#tilbud"
              className="btn-cta mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-bold text-white shadow-soft"
            >
              Få mit tilbud
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </a>
          </div>

          {/* Prikkort i glas-kort */}
          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-softlg backdrop-blur-sm">
              <DenmarkMap />
              <p className="mt-2 text-center text-sm text-white/55">
                Gratis afhentning i alle postnumre
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
