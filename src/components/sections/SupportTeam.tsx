import { Phone, PhoneOff, Check, ArrowRight } from "lucide-react";

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
  "Fast kontaktperson — ikke et callcenter",
  "Ringer typisk inden for 15 minutter",
  "Ærlig og helt uforpligtende rådgivning",
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
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Personlig service
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Et rigtigt menneske ringer dig op
            </h2>
            <p className="mt-4 text-lg text-ink/70">
              Når du skriver dig op, ringer en af vores faste danske
              bilkonsulenter dig personligt op — typisk inden for 15 minutter i
              åbningstiden. Ingen robotter, intet anonymt callcenter. Du får én
              fast kontaktperson, der kender din bil og guider dig hele vejen,
              til pengene står på kontoen.
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

            <a
              href="#tilbud"
              className="btn-cta mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-bold text-white shadow-soft"
            >
              <Phone className="h-4 w-4" strokeWidth={2.2} />
              Skriv dig op — så ringer vi
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </a>
          </div>

          {/* Højre: "indgående opkald"-kort + holdet */}
          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <div className="relative mx-auto max-w-sm rounded-3xl bg-ink p-6 text-white shadow-softlg ring-1 ring-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-white/60">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-tp" />
                  Indgående opkald
                </span>
                <span className="text-white/40">MinBilPris</span>
              </div>

              <div className="mt-8 flex flex-col items-center text-center">
                <div className="relative">
                  <span className="absolute -inset-2 animate-ping rounded-full ring-2 ring-tp/40" />
                  <img
                    src={featured.photo}
                    alt={featured.name}
                    loading="lazy"
                    decoding="async"
                    className="relative h-24 w-24 rounded-full object-cover ring-4 ring-white/10"
                  />
                </div>
                <p className="mt-4 text-xl font-bold">{featured.name}</p>
                <p className="text-sm text-white/55">Bilkonsulent</p>
                <p className="mt-3 text-sm text-white/70">
                  Ringer dig op om din{" "}
                  <span className="font-semibold text-white">VW Passat</span>
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand">
                    <PhoneOff className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className="text-xs text-white/50">Afvis</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-tp shadow-[0_0_0_8px_rgba(0,182,122,0.15)]">
                    <Phone className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className="text-xs text-white/50">Besvar</span>
                </div>
              </div>
            </div>

            {/* Holdet af faste konsulenter */}
            <div className="mt-6">
              <p className="text-center text-xs font-medium text-ink/55">
                Du får en fast kontaktperson — ikke et tilfældigt callcenter
              </p>
              <div className="mt-3 flex items-center justify-center gap-5">
                {CALLERS.map((c) => (
                  <div key={c.name} className="flex flex-col items-center">
                    <img
                      src={c.photo}
                      alt={c.name}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 rounded-full object-cover shadow-soft ring-2 ring-white"
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
    </section>
  );
}
