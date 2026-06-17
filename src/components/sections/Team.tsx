export function Team() {
  return (
    <section className="py-16 sm:py-24 bg-[#15151a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand mb-3">Mennesker, ikke maskiner</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Mød teamet</h2>
          <p className="mt-4 text-white/70">Et dansk hold der står klar til at hjælpe dig fra første kontakt til pengene er overført.</p>
        </div>

        {/* SWAP: rigtige team-portrætter og navne */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Medlem 1 */}
          <div className="reveal text-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" alt="Thomas Lund" loading="lazy" decoding="async" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-white/10" />
            <p className="font-bold text-white">Thomas Lund</p>
            <p className="text-sm text-brand font-semibold">Salg</p>
          </div>
          {/* Medlem 2 */}
          <div className="reveal text-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '80ms' }}>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" alt="Sofie Hansen" loading="lazy" decoding="async" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-white/10" />
            <p className="font-bold text-white">Sofie Hansen</p>
            <p className="text-sm text-trust font-semibold">Support</p>
          </div>
          {/* Medlem 3 */}
          <div className="reveal text-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '160ms' }}>
            <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80" alt="Mikkel Berg" loading="lazy" decoding="async" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-white/10" />
            <p className="font-bold text-white">Mikkel Berg</p>
            <p className="text-sm text-brand font-semibold">Eksport</p>
          </div>
          {/* Medlem 4 */}
          <div className="reveal text-center bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '240ms' }}>
            <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" alt="Anne Pedersen" loading="lazy" decoding="async" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-white/10" />
            <p className="font-bold text-white">Anne Pedersen</p>
            <p className="text-sm text-trust font-semibold">Vurdering</p>
          </div>
        </div>
      </div>
    </section>
  );
}
