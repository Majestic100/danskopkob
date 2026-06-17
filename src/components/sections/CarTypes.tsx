import { ArrowRight } from "lucide-react";

export function CarTypes() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">Vi køber både person- og varebiler</h2>
          <p className="mt-4 text-ink/70">Uanset om du sælger familiens bil eller firmaets transporter, giver vi et konkurrencedygtigt tilbud.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personbil */}
          <div className="reveal relative overflow-hidden rounded-3xl shadow-softlg group">
            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80" alt="Personbil" loading="lazy" decoding="async" className="zoom-img w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <h3 className="text-2xl font-extrabold text-white">Sælg din personbil</h3>
              <p className="text-white/80 text-sm mt-2 max-w-sm">Fra små bybiler til stationcars og SUV'er. Vi vurderer alle mærker og årgange.</p>
              <a href="#tilbud" className="btn-cta inline-flex items-center gap-2 mt-4 bg-brand text-white text-sm font-bold rounded-xl px-5 py-3">
                Få tilbud på personbil
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </a>
            </div>
          </div>

          {/* Varebil */}
          <div className="reveal relative overflow-hidden rounded-3xl shadow-softlg group" style={{ transitionDelay: '90ms' }}>
            <img src="https://images.unsplash.com/photo-1597766353939-3f5fd8c34d3c?auto=format&fit=crop&w=900&q=80" alt="Varebil" loading="lazy" decoding="async" className="zoom-img w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <h3 className="text-2xl font-extrabold text-white">Sælg din varebil</h3>
              <p className="text-white/80 text-sm mt-2 max-w-sm">Håndværkerbiler, kassevogne og pickups. Også selvom de har mange kilometer på.</p>
              <a href="#tilbud" className="btn-cta inline-flex items-center gap-2 mt-4 bg-trust text-white text-sm font-bold rounded-xl px-5 py-3">
                Få tilbud på varebil
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
