import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Fast bund-CTA på mobil, der glider op når man har scrollet forbi hero'en.
export function MobileCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/95 p-3 backdrop-blur transition-transform duration-300 sm:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <a
        href="#tilbud"
        className="btn-cta flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-bold text-white shadow-soft"
      >
        Få dit uforpligtende tilbud
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
      </a>
    </div>
  );
}
