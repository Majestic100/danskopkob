"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Brand {
  id: string;
  name: string;
}

interface Logos3Props {
  heading?: string;
  brands?: Brand[];
}

// Tilpasset shadcn-blokken "Logos3": i stedet for tech-logoer viser vi de
// bilmærker vi opkøber. Beholder Carousel + embla AutoScroll-mekanikken.
const Logos3 = ({
  heading = "Vi køber alle bilmærker — uanset model, årgang og stand",
  brands = [
    { id: "vw", name: "Volkswagen" },
    { id: "audi", name: "Audi" },
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
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
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
                className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <span className="whitespace-nowrap px-2 text-lg font-bold tracking-wide text-white/40 transition-colors hover:text-white lg:text-xl">
                  {brand.name}
                </span>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent"></div>
      </div>
    </div>
  );
};

export { Logos3 };
