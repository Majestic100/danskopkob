import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PreviewGate, usePreviewAccess } from "@/components/PreviewGate";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import SellCar from "@/pages/SellCar";

export default function App() {
  const { pathname, hash } = useLocation();
  const [unlocked, unlock] = usePreviewAccess();

  // Ved sideskift: scroll til top (medmindre der navigeres til et anker).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  // Scroll-reveal via IntersectionObserver — genkøres pr. side OG når der
  // låses op (ellers står alle .reveal-sektioner usynlige efter adgangskoden,
  // fordi observeren blev sat op mens kun låseskærmen var på siden).
  useEffect(() => {
    if (!unlocked) return;
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
  }, [pathname, unlocked]);

  // Lukket preview: hele sitet er bag adgangskode indtil lancering.
  if (!unlocked) return <PreviewGate onUnlock={unlock} />;

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/saelg-din-bil" element={<SellCar />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
