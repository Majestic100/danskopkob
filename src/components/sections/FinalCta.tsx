import { DanishFlag } from "@/components/icons";
import { LeadForm } from "@/components/LeadForm";

export function FinalCta() {
  return (
    <section
      id="tilbud"
      className="relative overflow-hidden bg-ink py-16 sm:py-24"
    >
      {/* Dekorativ glød */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-trust/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="reveal">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
            <DanishFlag className="w-5 h-3.5 rounded-sm" />
            <span className="text-xs font-semibold text-white">
              Gratis og uforpligtende
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Klar til at få mere for din bil?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Indtast din nummerplade og få et uforpligtende tilbud inden for få
            timer.
          </p>
        </div>

        <div className="reveal" style={{ transitionDelay: "80ms" }}>
          <LeadForm variant="cta" />
        </div>
      </div>
    </section>
  );
}
