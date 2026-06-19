import { Banknote } from "lucide-react";
import { DanishFlag, TrustStars } from "@/components/icons";
import { Counter } from "@/components/Counter";
import { LeadForm } from "@/components/LeadForm";
import { Logos3 } from "@/components/ui/logos3";

export function Hero({
  onLeadSuccess,
}: {
  onLeadSuccess: (plate: string) => void;
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        {/* Fuldt baggrundsbillede */}
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80"
          alt="Eksklusive biler i et mørkt showroom"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Mørke overlays for læsbarhed (mørkest i venstre side bag teksten) */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/40" />

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-28 lg:min-h-[700px] lg:px-8 lg:py-32">
          <div className="reveal max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-3 backdrop-blur">
                <DanishFlag className="h-4 w-6 rounded-sm" />
                <span className="text-xs font-semibold text-white/90">
                  Dansk virksomhed siden 2014
                </span>
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Sælg din bil og{" "}
              <span className="text-shimmer whitespace-nowrap">tjen mere</span>,
              fordi vi eksporterer den
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/75">
              Vi køber din brugte bil og sender den ud af landet. Derfor kan vi
              betale dig mere end det danske marked. Indtast din nummerplade og
              få et uforpligtende tilbud inden for få timer.
            </p>

            {/* Lead-formular i et rent hvidt kort, der popper på billedet */}
            <div className="mt-7 max-w-lg rounded-2xl border border-white/10 bg-white p-5 shadow-softlg">
              <LeadForm variant="hero" onSuccess={onLeadSuccess} />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <TrustStars />
              <span className="text-sm text-white/75">
                <strong className="text-white">Fremragende</strong> · 4,8 ud af
                5 på <strong className="text-tp">Trustpilot</strong> · 1.247
                anmeldelser
              </span>
            </div>
          </div>
        </div>

        {/* Flydende kort oven på billedet (kun store skærme) */}
        <div className="float-y-slow absolute right-8 top-8 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-softlg lg:flex">
          <DanishFlag className="h-5 w-7 rounded-sm" />
          <span className="text-xs font-semibold text-ink">Hele Danmark</span>
        </div>
        <div className="float-y absolute bottom-10 right-8 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-4 shadow-softlg lg:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tp/10">
            <Banknote className="h-6 w-6 text-tp" />
          </div>
          <div>
            <p className="text-xs leading-tight text-ink/60">
              Udbetalt til sælgere
            </p>
            <p className="text-lg font-extrabold leading-tight text-ink">
              <Counter target={184} /> mio. kr
            </p>
          </div>
        </div>
      </section>

      {/* Logo-marquee: bilmærker vi opkøber (lys stribe under hero'en) */}
      <div className="border-b border-black/5 bg-offwhite py-8">
        <div className="reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Logos3 />
        </div>
      </div>
    </>
  );
}
