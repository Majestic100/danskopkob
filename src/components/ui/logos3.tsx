"use client";

import { useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

interface Logos3Props {
  heading?: string;
  brands?: Brand[];
  dark?: boolean;
}

// Hvert mærke vises som en hvid "chip". Er der uploadet en logo-fil
// (public/logos/…), vises logoet i sine naturlige farver — ellers vises
// mærkets navn som tekst. Falder logoet fra (404), skiftes automatisk til
// navnet, så striben aldrig ser brudt ud.
function BrandLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(brand.logo) && !failed;

  return (
    <div className="flex h-14 min-w-[8.5rem] items-center justify-center rounded-xl bg-white px-6 shadow-sm ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {showImg ? (
        <img
          src={`${import.meta.env.BASE_URL}${brand.logo}`}
          alt={brand.name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-8 w-auto max-w-[7rem] object-contain"
        />
      ) : (
        <span className="whitespace-nowrap text-base font-bold tracking-wide text-ink/70">
          {brand.name}
        </span>
      )}
    </div>
  );
}

// Tilpasset shadcn-blokken "Logos3": i stedet for tech-logoer viser vi de
// bilmærker vi opkøber. Beholder Carousel + embla AutoScroll-mekanikken.
// `dark` skifter tekst-/fade-farver, så den kan ligge på mørk baggrund.
const Logos3 = ({
  heading = "Vi køber alle bilmærker — uanset model, årgang og stand",
  dark = false,
  brands = [
    { id: "vw", name: "Volkswagen", logo: "logos/vw.webp" },
    { id: "audi", name: "Audi", logo: "logos/audi.svg" },
    { id: "bmw", name: "BMW", logo: "logos/bmw.png" },
    { id: "mercedes", name: "Mercedes-Benz", logo: "logos/mercedes.svg" },
    { id: "skoda", name: "Škoda", logo: "logos/skoda.png" },
    { id: "toyota", name: "Toyota", logo: "logos/toyota.webp" },
    { id: "kia", name: "Kia", logo: "logos/kia.svg" },
    { id: "ford", name: "Ford", logo: "logos/ford.png" },
    { id: "volvo", name: "Volvo", logo: "logos/volvo.png" },
    { id: "peugeot", name: "Peugeot", logo: "logos/peugeot.png" },
    { id: "renault", name: "Renault", logo: "logos/renault.svg" },
    { id: "hyundai", name: "Hyundai", logo: "logos/hyundai.png" },
    { id: "opel", name: "Opel", logo: "logos/opel.png" },
    { id: "tesla", name: "Tesla", logo: "logos/tesla.png" },
  ],
}: Logos3Props) => {
  return (
    <div className="w-full">
      <p
        className={cn(
          "mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em]",
          dark ? "text-white/50" : "text-ink/45",
        )}
      >
        {heading}
      </p>
      <div className="relative mx-auto flex items-center justify-center">
        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[
            AutoScroll({
              playOnInit: true,
              speed: 0.8,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {brands.map((brand) => (
              <CarouselItem
                key={brand.id}
                className="flex basis-1/2 items-center justify-center py-2 pl-0 pr-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <BrandLogo brand={brand} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r to-transparent",
            dark ? "from-ink" : "from-offwhite",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l to-transparent",
            dark ? "from-ink" : "from-offwhite",
          )}
        />
      </div>
    </div>
  );
};

export { Logos3 };
