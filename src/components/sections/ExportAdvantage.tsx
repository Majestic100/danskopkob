import { Truck } from "lucide-react";

export function ExportAdvantage() {
  return (
    <section className="py-16 sm:py-24 bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-trust mb-3">Derfor får du mere</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">Du tjener mere, fordi vi eksporterer</h2>
          <p className="mt-4 text-ink/70 text-lg">
            På flere bilmodeller er efterspørgslen højere i udlandet end i Danmark. Vi sælger bilen videre på de markeder, hvor den er mest værd, og den fortjeneste deler vi med dig. Derfor lander vores tilbud ofte højere end det, du får ved et almindeligt dansk salg.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Case 1 */}
          {/* SWAP: rigtige case-tal */}
          <div className="reveal bg-white rounded-2xl p-6 shadow-soft hover:shadow-softlg transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-ink/5 flex items-center justify-center">
                <Truck className="w-6 h-6 text-ink" />
              </div>
              <div>
                <p className="font-bold text-ink leading-tight">VW Passat 2.0 TDI</p>
                <p className="text-xs text-ink/60">2017 · 168.000 km</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink/60">Dansk markedspris</dt><dd className="font-semibold text-ink/70 line-through">112.000 kr</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Dit tilbud hos os</dt><dd className="font-bold text-ink">131.000 kr</dd></div>
            </dl>
            <div className="mt-4 rounded-xl bg-tp/10 px-4 py-3 text-center">
              <span className="text-lg font-extrabold text-tp">+19.000 kr</span>
              <span className="block text-xs text-ink/60">mere til dig</span>
            </div>
          </div>

          {/* Case 2 */}
          <div className="reveal bg-white rounded-2xl p-6 shadow-soft hover:shadow-softlg transition-shadow" style={{ transitionDelay: '90ms' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-ink/5 flex items-center justify-center">
                <Truck className="w-6 h-6 text-ink" />
              </div>
              <div>
                <p className="font-bold text-ink leading-tight">BMW 320d Touring</p>
                <p className="text-xs text-ink/60">2019 · 121.000 km</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink/60">Dansk markedspris</dt><dd className="font-semibold text-ink/70 line-through">198.000 kr</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Dit tilbud hos os</dt><dd className="font-bold text-ink">226.500 kr</dd></div>
            </dl>
            <div className="mt-4 rounded-xl bg-tp/10 px-4 py-3 text-center">
              <span className="text-lg font-extrabold text-tp">+28.500 kr</span>
              <span className="block text-xs text-ink/60">mere til dig</span>
            </div>
          </div>

          {/* Case 3 */}
          <div className="reveal bg-white rounded-2xl p-6 shadow-soft hover:shadow-softlg transition-shadow" style={{ transitionDelay: '180ms' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-ink/5 flex items-center justify-center">
                <Truck className="w-6 h-6 text-ink" />
              </div>
              <div>
                <p className="font-bold text-ink leading-tight">Mercedes Vito 114</p>
                <p className="text-xs text-ink/60">2018 · 204.000 km</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink/60">Dansk markedspris</dt><dd className="font-semibold text-ink/70 line-through">94.000 kr</dd></div>
              <div className="flex justify-between"><dt className="text-ink/60">Dit tilbud hos os</dt><dd className="font-bold text-ink">109.000 kr</dd></div>
            </dl>
            <div className="mt-4 rounded-xl bg-tp/10 px-4 py-3 text-center">
              <span className="text-lg font-extrabold text-tp">+15.000 kr</span>
              <span className="block text-xs text-ink/60">mere til dig</span>
            </div>
          </div>
        </div>

        <p className="reveal mt-6 text-xs text-ink/50">Tallene er eksempler og afhænger af bilens stand, model, kilometerstand og udstyr. Dit konkrete tilbud beregnes individuelt.</p>
      </div>
    </section>
  );
}
