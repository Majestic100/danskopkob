import { ArrowRight, Phone } from "lucide-react";
import { TrustStars } from "@/components/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <a href="#top" className="flex select-none items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              Bil<span className="text-brand">Eksport</span>
            </span>
            <span className="hidden rounded-full border border-trust/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-trust sm:inline-block">
              Danmark
            </span>
          </a>

          <div className="flex items-center gap-3 sm:gap-5">
            <a href="#anmeldelser" className="hidden items-center gap-2 md:flex">
              <TrustStars />
              <span className="text-xs text-ink/70">
                <strong className="text-ink">4,8</strong> · 1.247 anmeldelser
              </span>
            </a>

            <a
              href="tel:+4570605040"
              className="hidden items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand sm:flex"
            >
              <Phone className="h-4 w-4" /> 70 60 50 40
            </a>

            <a
              href="#tilbud"
              className="btn-cta inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-soft sm:px-5"
            >
              Få tilbud
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
