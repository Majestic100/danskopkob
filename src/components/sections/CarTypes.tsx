import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Car, Truck, type LucideIcon } from "lucide-react";

// Billede med fallback-kæde: fejler ét link (404/fjernet på Unsplash),
// prøves det næste automatisk — så der aldrig vises et brækket ikon.
function FallbackImg({
  sources,
  alt,
  className,
}: {
  sources: string[];
  alt: string;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  return (
    <img
      src={sources[idx]}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setIdx((i) => Math.min(i + 1, sources.length - 1))}
      className={className}
    />
  );
}

interface CarType {
  kort: string; // kort label til mobil-fliserne
  titel: string;
  desc: string;
  cta: string;
  Icon: LucideIcon;
  accent: "brand" | "trust";
  sources: string[];
}

const TYPES: CarType[] = [
  {
    kort: "Personbil",
    titel: "Sælg din personbil",
    desc: "Fra små bybiler til stationcars og SUV'er. Vi vurderer alle mærker og årgange.",
    cta: "Få tilbud på personbil",
    Icon: Car,
    accent: "brand",
    sources: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    kort: "Varebil",
    titel: "Sælg din varebil",
    desc: "Håndværkerbiler, kassevogne og pickups. Også selvom de har mange kilometer på.",
    cta: "Få tilbud på varebil",
    Icon: Truck,
    accent: "trust",
    // SWAP: læg evt. jeres eget varebil-foto forrest her.
    sources: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1532941433101-b8d5e5178d3c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

export function CarTypes() {
  return (
    <section className="bg-white py-10 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto mb-5 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Vi køber både person- og varebiler
          </h2>
          <p className="mt-2 text-sm text-ink/70 sm:mt-4 sm:text-base">
            Vælg din biltype — vi giver et konkurrencedygtigt tilbud på begge.
          </p>
        </div>

        {/* Mobil: to kompakte valg-fliser side om side (de store billedkort
            blev for aflange på telefon). Fra md vises billedkortene. */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {TYPES.map((t) => {
            const { Icon } = t;
            return (
              <Link
                key={t.kort}
                to="/saelg-din-bil"
                className="reveal group flex flex-col items-center gap-3 rounded-2xl bg-offwhite p-5 text-center shadow-soft ring-1 ring-black/5 transition-all active:scale-[0.98]"
              >
                <span
                  className={
                    t.accent === "brand"
                      ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10"
                      : "flex h-14 w-14 items-center justify-center rounded-2xl bg-trust/10"
                  }
                >
                  <Icon
                    className={
                      t.accent === "brand"
                        ? "h-7 w-7 text-brand"
                        : "h-7 w-7 text-trust"
                    }
                    strokeWidth={2}
                  />
                </span>
                <span className="font-extrabold text-ink">{t.kort}</span>
                <span
                  className={
                    t.accent === "brand"
                      ? "mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand"
                      : "mt-auto inline-flex items-center gap-1 text-sm font-bold text-trust"
                  }
                >
                  Få tilbud
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop: de store billedkort som før */}
        <div className="hidden gap-6 md:grid md:grid-cols-2">
          {TYPES.map((t, i) => (
            <div
              key={t.kort}
              className="reveal group relative overflow-hidden rounded-3xl bg-ink shadow-softlg"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <FallbackImg
                sources={t.sources}
                alt={t.kort}
                className="zoom-img h-72 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7">
                <h3 className="text-2xl font-extrabold text-white">
                  {t.titel}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-white/80">{t.desc}</p>
                <Link
                  to="/saelg-din-bil"
                  className={
                    t.accent === "brand"
                      ? "btn-cta mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white"
                      : "btn-cta mt-4 inline-flex items-center gap-2 rounded-xl bg-trust px-5 py-3 text-sm font-bold text-white"
                  }
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Understøttende tekst, der før stod i overskriften */}
        <p className="reveal mt-4 text-center text-xs text-ink/50 md:hidden">
          Uanset om du sælger familiens bil eller firmaets transporter.
        </p>
      </div>
    </section>
  );
}
