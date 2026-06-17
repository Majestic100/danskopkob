import { useEffect, useState } from "react";

import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { UspBar } from "@/components/sections/UspBar";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ExportAdvantage } from "@/components/sections/ExportAdvantage";
import { Reviews } from "@/components/sections/Reviews";
import { VideoReviews } from "@/components/sections/VideoReviews";
import { Gallery } from "@/components/sections/Gallery";
import { Coverage } from "@/components/sections/Coverage";
import { CarTypes } from "@/components/sections/CarTypes";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { ThanksModal } from "@/components/ThanksModal";

export default function App() {
  const [thanksPlate, setThanksPlate] = useState<string | null>(null);

  // Scroll-reveal via IntersectionObserver (samme adfærd som den oprindelige side).
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main id="top">
        <Hero onLeadSuccess={setThanksPlate} />
        <UspBar />
        <HowItWorks />
        <ExportAdvantage />
        <Reviews />
        <VideoReviews />
        <Gallery />
        <Coverage />
        <CarTypes />
        <Team />
        <Faq />
        <FinalCta onLeadSuccess={setThanksPlate} />
      </main>
      <Footer />
      <ThanksModal plate={thanksPlate} onClose={() => setThanksPlate(null)} />
    </>
  );
}
