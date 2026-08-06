import { Play } from "lucide-react";
import { TrustStars } from "@/components/icons";
import { SwipeRow } from "@/components/SwipeRow";

// SWAP: rigtige videoanmeldelser (thumbnail + videolink) ind her.
// Tre videoer med hvert sit budskab: hastighed, merpris og hvor nemt det er.
const VIDEOS = [
  {
    name: "Jakob Mortensen",
    city: "Roskilde",
    duration: "1:24",
    theme: "Hvor hurtigt det gik",
    headline: "Solgt og betalt på 26 timer",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    quote:
      "Jeg udfyldte formularen tirsdag formiddag. Onsdag stod pengene på kontoen, før de kørte med bilen.",
  },
  {
    name: "Mette Sørensen",
    city: "Aarhus",
    duration: "0:58",
    theme: "Hvor meget mere hun fik",
    headline: "18.500 kr mere end forhandleren",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
    quote:
      "Jeg havde et bud fra min lokale forhandler. Tilbuddet her lå 18.500 kr højere for præcis samme bil.",
  },
  {
    name: "Anders Holm",
    city: "Kolding",
    duration: "1:47",
    theme: "Hvor nemt det var",
    headline: "Jeg skulle ikke gøre noget selv",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    quote:
      "Jeg slap for annoncer og fremvisninger. De klarede afmelding og papirer og hentede bilen hjemme hos mig.",
  },
];

export function VideoReviews() {
  return (
    <section className="bg-offwhite py-10 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-5 flex flex-col items-start justify-between gap-6 sm:mb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand sm:mb-3 sm:text-sm">
              Hør det fra dem selv
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Videoanmeldelser fra rigtige sælgere
            </h2>
            <p className="mt-2 text-sm text-ink/60 sm:mt-3 sm:text-base">
              Tre sælgere fortæller, hvordan deres handel gik.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft ring-1 ring-black/5 sm:inline-flex">
            <TrustStars className="flex" />
            <span className="text-sm font-semibold text-ink">4,8 ud af 5</span>
          </div>
        </div>

        <SwipeRow count={VIDEOS.length}>
          {/* Ingen reveal-animation på kortene: de forskudte forsinkelser fik
              kortene til at hænge i forskellige højder under scroll */}
          {VIDEOS.map((video) => (
            <figure
              key={video.name}
              className="swipe-card group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-softlg"
            >
              <div className="zoom-wrap relative cursor-pointer overflow-hidden">
                <img
                  src={video.photo}
                  alt={`Videoanmeldelse fra ${video.name}`}
                  loading="lazy"
                  decoding="async"
                  className="zoom-img h-52 w-full object-cover sm:h-72"
                />
                {/* Gradient + play-knap med pulserende ring */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 [animation-duration:2.2s]" />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-softlg transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                      <Play className="ml-1 h-6 w-6 text-brand sm:h-7 sm:w-7" fill="currentColor" />
                    </span>
                  </span>
                </div>
                <span className="absolute right-3 top-3 rounded-md bg-ink/75 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {video.duration}
                </span>
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand shadow-sm backdrop-blur">
                  {video.theme}
                </span>
                {/* Navn + by + stjerner på selve billedet */}
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5">
                  <TrustStars className="mb-1.5 flex" />
                  <p className="font-bold leading-tight">{video.name}</p>
                  <p className="text-sm text-white/70">{video.city}</p>
                </figcaption>
              </div>
              <div className="p-4 sm:p-5">
                <p className="font-extrabold leading-snug text-ink">
                  {video.headline}
                </p>
                <blockquote className="mt-1.5 text-sm italic leading-relaxed text-ink/65">
                  &ldquo;{video.quote}&rdquo;
                </blockquote>
              </div>
            </figure>
          ))}
        </SwipeRow>
      </div>
    </section>
  );
}
