import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Bund-CTA på mobil: glider op når man scroller ned forbi hero'en, og ned
// igen når man scroller opad. Modsat headeren, der vises ved scroll op —
// så er der aldrig to bjælker om pladsen på samme tid.
export function MobileCtaBar() {
  const [show, setShow] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY.current;
      if (y <= 640) setShow(false);
      else if (diff > 4) setShow(true);
      else if (diff < -4) setShow(false);
      lastY.current = y;
    };
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
      <Link
        to="/saelg-din-bil"
        className="btn-cta flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-bold text-white shadow-soft"
      >
        Få dit uforpligtende tilbud
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
      </Link>
    </div>
  );
}
