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
    <section className="relative overflow-hidden bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Venstre: tekst + formular */}
          <div className="reveal">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-soft">
                <DanishFlag className="h-4 w-6 rounded-sm" />
                <span className="text-xs font-semibold text-ink/80">
                  Dansk virksomhed siden 2014
                </span>
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Sælg din bil og <span className="text-brand">tjen mere</span>,
              fordi vi eksporterer den
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">
              Vi køber din brugte bil og sender den ud af landet. Derfor kan vi
              betale dig mere end det danske marked. Indtast din nummerplade og
              få et uforpligtende tilbud inden for få timer.
            </p>

            <LeadForm variant="hero" onSuccess={onLeadSuccess} />

            <div className="mt-6 flex items-center gap-3">
              <TrustStars />
              <span className="text-sm text-ink/70">
                <strong className="text-ink">Fremragende</strong> · 4,8 ud af 5
                på <strong className="text-tp">Trustpilot</strong> · 1.247
                anmeldelser
              </span>
            </div>
          </div>

          {/* Højre: hero-billede */}
          <div className="reveal relative" style={{ transitionDelay: "120ms" }}>
            <div className="relative overflow-hidden rounded-3xl shadow-softlg">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
                alt="Glad bilsælger med nøgler til sin bil"
                width={1200}
                height={800}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </div>

            {/* Flydende kort: udbetalt */}
            <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-softlg sm:left-6">
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

            {/* Flydende kort: dansk flag badge */}
            <div className="absolute -top-3 -right-2 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-softlg sm:right-4">
              <DanishFlag className="h-5 w-7 rounded-sm" />
              <span className="text-xs font-semibold text-ink">Hele Danmark</span>
            </div>
          </div>
        </div>

        {/* Logo-marquee: bilmærker vi opkøber (shadcn Logos3 + embla AutoScroll) */}
        <div className="reveal mt-14 lg:mt-20" style={{ transitionDelay: "200ms" }}>
          <Logos3 />
        </div>
      </div>
    </section>
  );
}
