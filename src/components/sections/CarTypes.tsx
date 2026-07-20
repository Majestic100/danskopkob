import { useState } from "react";
import { ArrowRight } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

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

const PERSONBIL_SOURCES = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=80",
];

// SWAP: læg evt. jeres eget varebil-foto i public/ og sæt det forrest her.
const VAREBIL_SOURCES = [
  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1532941433101-b8d5e5178d3c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80",
];

export function CarTypes() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">Vi køber både person- og varebiler</h2>
          <p className="mt-4 text-ink/70">Uanset om du sælger familiens bil eller firmaets transporter, giver vi et konkurrencedygtigt tilbud.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personbil */}
          <div className="reveal relative overflow-hidden rounded-3xl shadow-softlg group bg-ink">
            <FallbackImg sources={PERSONBIL_SOURCES} alt="Personbil" className="zoom-img w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <h3 className="text-2xl font-extrabold text-white">Sælg din personbil</h3>
              <p className="text-white/80 text-sm mt-2 max-w-sm">Fra små bybiler til stationcars og SUV'er. Vi vurderer alle mærker og årgange.</p>
              <a href={`${BASE}#tilbud`} className="btn-cta inline-flex items-center gap-2 mt-4 bg-brand text-white text-sm font-bold rounded-xl px-5 py-3">
                Få tilbud på personbil
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </a>
            </div>
          </div>

          {/* Varebil */}
          <div className="reveal relative overflow-hidden rounded-3xl shadow-softlg group bg-ink" style={{ transitionDelay: '90ms' }}>
            <FallbackImg sources={VAREBIL_SOURCES} alt="Varebil" className="zoom-img w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <h3 className="text-2xl font-extrabold text-white">Sælg din varebil</h3>
              <p className="text-white/80 text-sm mt-2 max-w-sm">Håndværkerbiler, kassevogne og pickups. Også selvom de har mange kilometer på.</p>
              <a href={`${BASE}#tilbud`} className="btn-cta inline-flex items-center gap-2 mt-4 bg-trust text-white text-sm font-bold rounded-xl px-5 py-3">
                Få tilbud på varebil
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
