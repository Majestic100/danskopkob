import { Play } from "lucide-react";
import { TrustStars } from "@/components/icons";

// SWAP: rigtige videoanmeldelser (thumbnail + videolink) ind her
const VIDEOS = [
  {
    name: "Jakob Mortensen",
    city: "Roskilde",
    duration: "1:24",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    quote:
      "De bød 18.500 over forhandlerens tilbud — og hentede bilen to dage senere.",
  },
  {
    name: "Mette Sørensen",
    city: "Aarhus",
    duration: "0:58",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
    quote:
      "Jeg havde aldrig solgt bil før. De guidede mig igennem det hele på ét opkald.",
  },
  {
    name: "Anders Holm",
    city: "Kolding",
    duration: "1:47",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    quote: "Fra nummerplade til penge på kontoen på under 48 timer.",
  },
];

export function VideoReviews() {
  return (
    <section className="bg-offwhite py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Hør det fra dem selv
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Videoanmeldelser fra rigtige sælgere
            </h2>
            <p className="mt-3 text-ink/60">
              Ingen manuskript, ingen skuespillere — bare tre sælgere, der
              fortæller, hvordan deres handel gik.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft ring-1 ring-black/5 sm:inline-flex">
            <TrustStars className="flex" />
            <span className="text-sm font-semibold text-ink">4,8 ud af 5</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video, i) => (
            <figure
              key={video.name}
              className="reveal group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-softlg"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="zoom-wrap relative cursor-pointer overflow-hidden">
                <img
                  src={video.photo}
                  alt={`Videoanmeldelse fra ${video.name}`}
                  loading="lazy"
                  decoding="async"
                  className="zoom-img h-72 w-full object-cover"
                />
                {/* Gradient + play-knap med pulserende ring */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-16 w-16 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 [animation-duration:2.2s]" />
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-softlg transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-7 w-7 text-brand" fill="currentColor" />
                    </span>
                  </span>
                </div>
                <span className="absolute right-3 top-3 rounded-md bg-ink/75 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {video.duration}
                </span>
                {/* Navn + by + stjerner på selve billedet */}
                <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <TrustStars className="mb-1.5 flex" />
                  <p className="font-bold leading-tight">{video.name}</p>
                  <p className="text-sm text-white/70">{video.city}</p>
                </figcaption>
              </div>
              <blockquote className="p-5 text-sm italic leading-relaxed text-ink/70">
                &ldquo;{video.quote}&rdquo;
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
