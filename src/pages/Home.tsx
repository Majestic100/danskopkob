import { useEffect } from "react";

import { Hero } from "@/components/sections/Hero";
import { UspBar } from "@/components/sections/UspBar";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ExportAdvantage } from "@/components/sections/ExportAdvantage";
import { Reviews } from "@/components/sections/Reviews";
import { VideoReviews } from "@/components/sections/VideoReviews";
import { Gallery } from "@/components/sections/Gallery";
import { Coverage } from "@/components/sections/Coverage";
import { CarTypes } from "@/components/sections/CarTypes";
import { SupportTeam } from "@/components/sections/SupportTeam";
import { Faq } from "@/components/sections/Faq";
import { TestimonialsMarquee } from "@/components/sections/TestimonialsMarquee";
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
      <VideoReviews />
      <Gallery />
      <Coverage />
      <CarTypes />
      <SupportTeam />
      <Faq />
      <TestimonialsMarquee />
      <FinalCta />
      <MobileCtaBar />
      <SocialProofToasts />
    </>
  );
}
