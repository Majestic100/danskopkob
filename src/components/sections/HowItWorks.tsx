import { Car, MessageSquare, Truck, Banknote, ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-[#0d0d10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand mb-3">Nemt og hurtigt</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Sådan fungerer det</h2>
          <p className="mt-4 text-white/70">Fire enkle trin fra nummerplade til penge på kontoen.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Trin 1 */}
          <div className="reveal relative bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft hover:shadow-softlg hover:border-white/20 transition-shadow">
            <span className="absolute top-5 right-5 text-5xl font-extrabold text-white/10">01</span>
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
              <Car className="w-6 h-6 text-brand" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Indtast nummerplade</h3>
            <p className="text-sm text-white/70">Skriv din nummerplade, så går vi straks i gang. Det tager under et minut.</p>
          </div>
          {/* Trin 2 */}
          <div className="reveal relative bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft hover:shadow-softlg hover:border-white/20 transition-shadow" style={{ transitionDelay: '90ms' }}>
            <span className="absolute top-5 right-5 text-5xl font-extrabold text-white/10">02</span>
            <div className="w-12 h-12 rounded-xl bg-trust/10 flex items-center justify-center mb-5">
              <MessageSquare className="w-6 h-6 text-trust" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Få et tilbud</h3>
            <p className="text-sm text-white/70">Vi vurderer bilen og sender dig et konkret tilbud inden for få timer.</p>
          </div>
          {/* Trin 3 */}
          <div className="reveal relative bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft hover:shadow-softlg hover:border-white/20 transition-shadow" style={{ transitionDelay: '180ms' }}>
            <span className="absolute top-5 right-5 text-5xl font-extrabold text-white/10">03</span>
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
              <Truck className="w-6 h-6 text-brand" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Vi afhenter gratis</h3>
            <p className="text-sm text-white/70">Uanset hvor i landet bilen står, henter vi den uden beregning.</p>
          </div>
          {/* Trin 4 */}
          <div className="reveal relative bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft hover:shadow-softlg hover:border-white/20 transition-shadow" style={{ transitionDelay: '270ms' }}>
            <span className="absolute top-5 right-5 text-5xl font-extrabold text-white/10">04</span>
            <div className="w-12 h-12 rounded-xl bg-tp/10 flex items-center justify-center mb-5">
              <Banknote className="w-6 h-6 text-tp" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Du får pengene</h3>
            <p className="text-sm text-white/70">Beløbet overføres til din konto, typisk samme dag som afhentningen.</p>
          </div>
        </div>

        <div className="reveal text-center mt-10">
          <a href="#tilbud" className="btn-cta inline-flex items-center gap-2 bg-brand text-white font-bold rounded-xl px-7 py-4 shadow-soft">
            Start med din nummerplade
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
