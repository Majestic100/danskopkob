import { useState } from "react";
import { Clock, MapPin } from "lucide-react";

// Fotos af de opkøbte biler ligger i public/biler/. Skal en bil skiftes ud,
// læg filen dér og skriv filnavnet i `photo` herunder. Mangler filen, vises
// et neutralt felt med bilens navn i stedet, aldrig et brækket billede.
const BASE = import.meta.env.BASE_URL;

interface Case {
  model: string;
  meta: string;
  city: string;
  hours: string; // fra kontakt til salg
  timeline: string; // fra udfyldt formular til betalt og afhentet
  market: string;
  offer: string;
  diff: string;
  photo?: string;
}

// SWAP: rigtige case-tal
const CASES: Case[] = [
  {
    model: "VW Passat 2.0 TDI",
    meta: "2017 · 168.000 km",
    city: "Aarhus",
    hours: "2 timer fra kontakt til salg",
    timeline: "Formular kl. 09:14 → betalt og afhentet næste dag kl. 10:20",
    market: "112.000 kr",
    offer: "131.000 kr",
    diff: "+19.000 kr",
    photo: "biler/vw-passat-20-tdi.webp",
  },
  {
    model: "BMW 320d Touring",
    meta: "2019 · 121.000 km",
    city: "København",
    hours: "4 timer fra kontakt til salg",
    timeline: "Formular kl. 11:40 → betalt og afhentet dagen efter kl. 13:05",
    market: "198.000 kr",
    offer: "226.500 kr",
    diff: "+28.500 kr",
    photo: "biler/bmw-320d-touring.webp",
  },
  {
    model: "Mercedes Vito 114",
    meta: "2018 · 204.000 km",
    city: "Esbjerg",
    hours: "3 timer fra kontakt til salg",
    timeline: "Formular kl. 08:05 → betalt og afhentet samme dag kl. 16:30",
    market: "94.000 kr",
    offer: "109.000 kr",
    diff: "+15.000 kr",
    photo: "biler/mercedes-vito-114.webp",
  },
];

function CarPhoto({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-ink/[0.06] to-ink/[0.02]">
        <span className="px-4 text-center text-sm font-semibold text-ink/35">
          {alt}
        </span>
      </div>
    );
  }
  return (
    <img
      src={`${BASE}${src}`}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="zoom-img h-44 w-full object-cover"
    />
  );
}

export function ExportAdvantage() {
  return (
    <section className="bg-offwhite py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-trust">
            Derfor får du mere
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Vi sælger din bil videre til hele Europa
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            Vi har faste aftaler med bilforhandlere i hele Europa, og mange
            modeller er mere værd hos dem end på det danske marked. Vi sælger
            bilen dér, hvor prisen er højest, og deler forskellen med dig.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CASES.map((c, i) => (
            <article
              key={c.model}
              className="reveal zoom-wrap overflow-hidden rounded-2xl bg-white shadow-soft transition-shadow hover:shadow-softlg"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="relative overflow-hidden">
                <CarPhoto src={c.photo} alt={c.model} />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur">
                  <MapPin className="h-3.5 w-3.5 text-brand" /> {c.city}
                </span>
              </div>

              <div className="p-6">
                <p className="font-bold leading-tight text-ink">{c.model}</p>
                <p className="text-xs text-ink/60">{c.meta}</p>

                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink/60">Dansk markedspris</dt>
                    <dd className="font-semibold text-ink/70 line-through">
                      {c.market}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/60">Dit tilbud hos os</dt>
                    <dd className="font-bold text-ink">{c.offer}</dd>
                  </div>
                </dl>

                <div className="mt-4 rounded-xl bg-tp/10 px-4 py-3 text-center">
                  <span className="text-lg font-extrabold text-tp">
                    {c.diff}
                  </span>
                  <span className="block text-xs text-ink/60">mere til dig</span>
                </div>

                <div className="mt-4 space-y-2 border-t border-black/5 pt-4">
                  <p className="flex items-start gap-2 text-xs font-semibold text-ink/70">
                    <Clock
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"
                      strokeWidth={2.2}
                    />
                    {c.hours}
                  </p>
                  <p className="text-xs leading-relaxed text-ink/50">
                    {c.timeline}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="reveal mt-6 text-xs text-ink/50">
          Tallene er eksempler. Dit tilbud afhænger af bilens model, stand,
          kilometerstand og udstyr.
        </p>
      </div>
    </section>
  );
}
