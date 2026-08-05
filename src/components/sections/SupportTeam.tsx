import { Phone, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { DanishFlag } from "@/components/icons";

interface Caller {
  name: string;
  photo: string;
}

const CALLERS: Caller[] = [
  {
    name: "Sofie Hansen",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Thomas Lund",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mikkel Berg",
    photo:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Anne Pedersen",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
];

const BULLETS = [
  "Dansktalende rådgivere",
  "Én fast kontaktperson hele vejen",
  "Ringer typisk inden for 15 minutter",
  "Helt uforpligtende rådgivning",
];

const STATS = [
  { value: "~12 min", label: "Gns. svartid" },
  { value: "4,8 ★", label: "Kundetilfredshed" },
  { value: "50.000+", label: "Bilejere hjulpet" },
];

export function SupportTeam() {
  const featured = CALLERS[0];

  return (
    <section className="bg-offwhite py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Venstre: fortælling */}
          <div className="reveal">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand">
              <DanishFlag className="h-3.5 w-5 rounded-[2px]" />
              Dansk kundeservice
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Et rigtigt menneske ringer dig op
            </h2>
            <p className="mt-4 text-lg text-ink/70">
              Når du skriver dig op, ringer en af vores danske bilkonsulenter
              dig op, typisk inden for 15 minutter i åbningstiden. Du får én
              fast kontaktperson, der følger din handel, til pengene står på
              kontoen.
            </p>

            <ul className="mt-6 space-y-3">
              {BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-sm font-semibold text-ink"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tp/10">
                    <Check className="h-3.5 w-3.5 text-tp" strokeWidth={2.5} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/5 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold tracking-tight text-ink">
                    {s.value}
                  </p>
                  <p className="text-xs text-ink/55">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/saelg-din-bil"
              className="btn-cta mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-bold text-white shadow-soft"
            >
              <Phone className="h-4 w-4" strokeWidth={2.2} />
              Skriv dig op, så ringer vi
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>

          {/* Højre: rent rådgiver-kort (erstatter det tidligere fake
              "indgående opkald"-mockup). Skjult på mobil, hvor det blot
              forlængede siden — telefonnummeret er i forvejen i menuen,
              den faste bund-CTA og footeren. */}
          <div
            className="reveal hidden lg:block"
            style={{ transitionDelay: "120ms" }}
          >
            <div className="mx-auto max-w-sm rounded-3xl bg-white p-7 shadow-softlg ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <img
                  src={featured.photo}
                  alt={featured.name}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-black/5"
                />
                <div>
                  <p className="text-lg font-extrabold leading-tight text-ink">
                    {featured.name}
                  </p>
                  <p className="text-sm text-ink/55">Bilkonsulent</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-tp">
                    <span className="h-1.5 w-1.5 rounded-full bg-tp" />
                    Klar ved telefonen nu
                  </span>
                </div>
              </div>

              <a
                href="tel:+4570605040"
                className="btn-cta mt-6 flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-bold text-white"
              >
                <Phone className="h-4 w-4" strokeWidth={2.2} />
                70 60 50 40
              </a>
              <p className="mt-2 text-center text-xs text-ink/50">
                Hverdage 8–20 · weekend 10–16
              </p>

              {/* Holdet af faste konsulenter */}
              <div className="mt-6 border-t border-black/5 pt-5">
                <p className="text-center text-xs font-medium text-ink/55">
                  Du får en fast kontaktperson gennem hele handlen
                </p>
                <div className="mt-3 flex items-center justify-center gap-5">
                  {CALLERS.map((c) => (
                    <div key={c.name} className="flex flex-col items-center">
                      <img
                        src={c.photo}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        className="h-11 w-11 rounded-full object-cover shadow-soft ring-2 ring-white"
                      />
                      <span className="mt-1.5 text-[11px] font-semibold text-ink">
                        {c.name.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
