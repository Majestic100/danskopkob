import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

// "Seneste opkøb"-tavle: rigtige mærke-logoer (public/logos) i stedet for
// stock-fotos, der alligevel viste de forkerte biler.
// SWAP: rigtige handler ind her — evt. med foto af den faktiske bil.
const PURCHASES = [
  {
    logo: "logos/audi.svg",
    brand: "Audi",
    model: "A4 Avant 2.0 TDI",
    meta: "2018 · 168.000 km · Diesel",
    price: "142.500 kr",
    city: "Aarhus C",
    when: "for 2 dage siden",
  },
  {
    logo: "logos/bmw.png",
    brand: "BMW",
    model: "520d Touring",
    meta: "2017 · 189.000 km · Diesel",
    price: "156.000 kr",
    city: "København Ø",
    when: "for 4 dage siden",
  },
  {
    logo: "logos/mercedes.svg",
    brand: "Mercedes-Benz",
    model: "C 220 d",
    meta: "2016 · 204.000 km · Diesel",
    price: "118.000 kr",
    city: "Odense C",
    when: "for 5 dage siden",
  },
  {
    logo: "logos/vw.webp",
    brand: "Volkswagen",
    model: "Golf 1.6 TDI",
    meta: "2015 · 178.000 km · Diesel",
    price: "61.500 kr",
    city: "Aalborg",
    when: "for 1 uge siden",
  },
  {
    logo: "logos/skoda.png",
    brand: "Škoda",
    model: "Octavia Combi",
    meta: "2019 · 142.000 km · Diesel",
    price: "104.000 kr",
    city: "Esbjerg",
    when: "for 1 uge siden",
  },
  {
    logo: "logos/ford.png",
    brand: "Ford",
    model: "Transit Custom",
    meta: "2018 · 221.000 km · Diesel",
    price: "76.000 kr",
    city: "Vejle",
    when: "for 2 uger siden",
  },
];

export function Gallery() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-trust">
              Seneste opkøb
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Biler vi har købt de seneste uger
            </h2>
            <p className="mt-3 text-ink/60">
              Et udpluk af rigtige handler fra hele landet — fra familiebiler
              til varevogne. Beløbet er det, sælgeren fik udbetalt.
            </p>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
            <span className="inline-flex items-center gap-2 rounded-full bg-tp/10 px-4 py-2 text-sm font-semibold text-tp">
              <BadgeCheck className="h-4 w-4" /> 184 mio. kr udbetalt til
              sælgere
            </span>
            <span className="text-xs text-ink/50">
              Gratis afhentning i hele Danmark
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PURCHASES.map((car, i) => (
            <article
              key={`${car.brand}-${car.model}`}
              className="reveal group flex flex-col rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-softlg"
              style={{ transitionDelay: `${(i % 3) * 70}ms` }}
            >
              <div className="flex flex-wrap-reverse items-start justify-between gap-x-3 gap-y-2">
                <div>
                  <p className="whitespace-nowrap text-xs text-ink/50">
                    Udbetalt samme dag
                  </p>
                  <p className="whitespace-nowrap text-2xl font-extrabold leading-tight text-ink">
                    {car.price}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-tp/10 px-3 py-1 text-xs font-bold text-tp">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Købt {car.when}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2.5">
                <img
                  src={`${BASE}${car.logo}`}
                  alt={car.brand}
                  loading="lazy"
                  decoding="async"
                  className="h-6 w-auto max-w-[2.25rem] object-contain"
                />
                <h3 className="text-lg font-extrabold tracking-tight text-ink">
                  {car.brand} {car.model}
                </h3>
              </div>
              <p className="mt-0.5 text-sm text-ink/55">{car.meta}</p>

              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                <span className="inline-flex items-center gap-1 text-sm text-ink/55">
                  <MapPin className="h-4 w-4" /> {car.city}
                </span>
                <span className="text-xs text-ink/45">
                  Gratis afhentet på adressen
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-ink/60">
            Din bil kunne være den næste — det tager 2 minutter at få prisen.
          </p>
          <a
            href={`${BASE}#tilbud`}
            className="btn-cta inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-bold text-white shadow-soft"
          >
            Se hvad din bil er værd
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
