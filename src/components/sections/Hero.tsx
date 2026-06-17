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
    <section className="relative overflow-hidden bg-ink">
      {/* Premium-glød */}
      <div className="pointer-events-none absolute -top-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-brand/25 blur-[120px]" />
      <div className="pointer-events-none absolute left-[-10rem] top-1/3 h-[26rem] w-[26rem] rounded-full bg-trust/20 blur-[130px]" />
      {/* Subtilt gitter */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:46px_46px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Venstre: tekst + formular */}
          <div className="reveal">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 backdrop-blur">
                <DanishFlag className="h-4 w-6 rounded-sm" />
                <span className="text-xs font-semibold text-white/80">
                  Dansk virksomhed siden 2014
                </span>
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Sælg din bil og{" "}
              <span className="bg-gradient-to-r from-brand to-[#ff5b66] bg-clip-text text-transparent">
                tjen mere
              </span>
              , fordi vi eksporterer den
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/65">
              Vi køber din brugte bil og sender den ud af landet. Derfor kan vi
              betale dig mere end det danske marked. Indtast din nummerplade og
              få et uforpligtende tilbud inden for få timer.
            </p>

            {/* Glas-kort om lead-formularen */}
            <div className="mt-7 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-4 shadow-softlg backdrop-blur-md sm:p-5">
              <LeadForm variant="hero" onSuccess={onLeadSuccess} />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <TrustStars />
              <span className="text-sm text-white/65">
                <strong className="text-white">Fremragende</strong> · 4,8 ud af
                5 på <strong className="text-tp">Trustpilot</strong> · 1.247
                anmeldelser
              </span>
            </div>
          </div>

          {/* Højre: hero-billede */}
          <div className="reveal relative" style={{ transitionDelay: "120ms" }}>
            <div className="relative overflow-hidden rounded-3xl shadow-softlg ring-1 ring-white/10">
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
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            </div>

            {/* Flydende kort: udbetalt */}
            <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 shadow-softlg backdrop-blur-md sm:left-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tp/15">
                <Banknote className="h-6 w-6 text-tp" />
              </div>
              <div>
                <p className="text-xs leading-tight text-white/60">
                  Udbetalt til sælgere
                </p>
                <p className="text-lg font-extrabold leading-tight text-white">
                  <Counter target={184} /> mio. kr
                </p>
              </div>
            </div>

            {/* Flydende kort: dansk flag badge */}
            <div className="absolute -top-3 -right-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-softlg backdrop-blur-md sm:right-4">
              <DanishFlag className="h-5 w-7 rounded-sm" />
              <span className="text-xs font-semibold text-white">
                Hele Danmark
              </span>
            </div>
          </div>
        </div>

        {/* Logo-marquee: bilmærker vi opkøber (shadcn Logos3 + embla AutoScroll) */}
        <div
          className="reveal mt-14 lg:mt-20"
          style={{ transitionDelay: "200ms" }}
        >
          <Logos3 />
        </div>
      </div>
    </section>
  );
}
