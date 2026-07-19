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

// Viser mærkets uploadede logo (public/logos/…) hvis `logo` er sat — ellers
// vises mærkets navn som tekst (så striben aldrig ser brudt ud).
function BrandLogo({ brand, dark }: { brand: Brand; dark?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const label = (
    <span
      className={cn(
        "whitespace-nowrap px-2 text-lg font-bold tracking-wide transition-colors lg:text-xl",
        dark ? "text-white/40 hover:text-white" : "text-ink/40 hover:text-ink",
      )}
    >
      {brand.name}
    </span>
  );

  if (!brand.logo) return label;

  return (
    <>
      <img
        src={`${import.meta.env.BASE_URL}${brand.logo}`}
        alt={brand.name}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-7 w-auto object-contain transition lg:h-8",
          loaded ? "block" : "hidden",
          dark
            ? "opacity-80 brightness-0 invert hover:opacity-100"
            : "opacity-70 grayscale hover:opacity-100 hover:grayscale-0",
        )}
      />
      {!loaded && label}
    </>
  );
}

// Tilpasset shadcn-blokken "Logos3": i stedet for tech-logoer viser vi de
// bilmærker vi opkøber. Beholder Carousel + embla AutoScroll-mekanikken.
// `dark` skifter farver, så den kan ligge på mørk baggrund.
const Logos3 = ({
  heading = "Vi køber alle bilmærker — uanset model, årgang og stand",
  dark = false,
  brands = [
    { id: "vw", name: "Volkswagen", logo: "logos/Volkswagen_logo_2019.svg.webp" },
    { id: "audi", name: "Audi", logo: "logos/Audi-Logo_2016.svg" },
    { id: "bmw", name: "BMW" },
    { id: "mercedes", name: "Mercedes-Benz" },
    { id: "skoda", name: "Škoda" },
    { id: "toyota", name: "Toyota" },
    { id: "ford", name: "Ford" },
    { id: "volvo", name: "Volvo" },
    { id: "peugeot", name: "Peugeot" },
    { id: "renault", name: "Renault" },
    { id: "kia", name: "Kia" },
    { id: "hyundai", name: "Hyundai" },
    { id: "opel", name: "Opel" },
    { id: "tesla", name: "Tesla" },
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
                className="flex basis-1/3 items-center justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <BrandLogo brand={brand} dark={dark} />
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
