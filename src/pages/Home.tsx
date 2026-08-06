import { useEffect } from "react";

import { Hero } from "@/components/sections/Hero";
import { UspBar } from "@/components/sections/UspBar";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ExportAdvantage } from "@/components/sections/ExportAdvantage";
import { Reviews } from "@/components/sections/Reviews";
import { VideoReviews } from "@/components/sections/VideoReviews";
// PARKERET: "Biler vi har købt" (Gallery) er taget af siden efter aftale.
// Komponenten ligger stadig i src/components/sections/Gallery.tsx — tænd den
// igen ved at gen-importere den og sætte <Gallery /> ind under <VideoReviews />.
import { Coverage } from "@/components/sections/Coverage";
import { CarTypes } from "@/components/sections/CarTypes";
import { SupportTeam } from "@/components/sections/SupportTeam";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { SocialProofToasts } from "@/components/SocialProofToasts";

export default function Home() {
  useEffect(() => {
    document.title =
      "MinBilPris | Sælg din bil og tjen mere fordi vi eksporterer";
  }, []);

  return (
    <>
      <Hero />
      <UspBar />
      <HowItWorks />
      <ExportAdvantage />
      <Reviews />
      <Coverage />
      <CarTypes />
      <SupportTeam />
      <Faq />
      {/* Videoanmeldelserne lå før lige under de skrevne anmeldelser. Her
          bryder de op i siden og lander som sidste tryghedssignal, inden
          man bliver bedt om nummerpladen. */}
      <VideoReviews />
      <FinalCta />
      <MobileCtaBar />
      <SocialProofToasts />
    </>
  );
}
