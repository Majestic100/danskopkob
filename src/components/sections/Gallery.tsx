export function Gallery() {
  return (
    <section className="py-16 sm:py-24 bg-[#0d0d10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-trust mb-3">Udvalg fra de seneste uger</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Biler vi har købt</h2>
        </div>

        {/* SWAP: rigtige billeder af opkøbte biler */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Bil 1 */}
          <div className="reveal zoom-wrap rounded-2xl overflow-hidden shadow-soft bg-white/5 border border-white/10">
            <div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80" alt="Audi A4" loading="lazy" decoding="async" className="zoom-img w-full h-56 object-cover" /></div>
            <div className="p-5 flex items-center justify-between"><p className="font-bold text-white">Audi A4 Avant</p><span className="text-sm text-white/55">8000 Aarhus C</span></div>
          </div>
          {/* Bil 2 */}
          <div className="reveal zoom-wrap rounded-2xl overflow-hidden shadow-soft bg-white/5 border border-white/10" style={{ transitionDelay: '70ms' }}>
            <div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=700&q=80" alt="BMW 5-serie" loading="lazy" decoding="async" className="zoom-img w-full h-56 object-cover" /></div>
            <div className="p-5 flex items-center justify-between"><p className="font-bold text-white">BMW 520d</p><span className="text-sm text-white/55">2100 København Ø</span></div>
          </div>
          {/* Bil 3 */}
          <div className="reveal zoom-wrap rounded-2xl overflow-hidden shadow-soft bg-white/5 border border-white/10" style={{ transitionDelay: '140ms' }}>
            <div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=700&q=80" alt="Mercedes C-klasse" loading="lazy" decoding="async" className="zoom-img w-full h-56 object-cover" /></div>
            <div className="p-5 flex items-center justify-between"><p className="font-bold text-white">Mercedes C 220 d</p><span className="text-sm text-white/55">5000 Odense C</span></div>
          </div>
          {/* Bil 4 */}
          <div className="reveal zoom-wrap rounded-2xl overflow-hidden shadow-soft bg-white/5 border border-white/10" style={{ transitionDelay: '40ms' }}>
            <div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80" alt="VW Golf" loading="lazy" decoding="async" className="zoom-img w-full h-56 object-cover" /></div>
            <div className="p-5 flex items-center justify-between"><p className="font-bold text-white">VW Golf 1.6 TDI</p><span className="text-sm text-white/55">9000 Aalborg</span></div>
          </div>
          {/* Bil 5 */}
          <div className="reveal zoom-wrap rounded-2xl overflow-hidden shadow-soft bg-white/5 border border-white/10" style={{ transitionDelay: '110ms' }}>
            <div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=700&q=80" alt="Skoda Octavia" loading="lazy" decoding="async" className="zoom-img w-full h-56 object-cover" /></div>
            <div className="p-5 flex items-center justify-between"><p className="font-bold text-white">Skoda Octavia Combi</p><span className="text-sm text-white/55">6700 Esbjerg</span></div>
          </div>
          {/* Bil 6 */}
          <div className="reveal zoom-wrap rounded-2xl overflow-hidden shadow-soft bg-white/5 border border-white/10" style={{ transitionDelay: '180ms' }}>
            <div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=700&q=80" alt="Ford Transit" loading="lazy" decoding="async" className="zoom-img w-full h-56 object-cover" /></div>
            <div className="p-5 flex items-center justify-between"><p className="font-bold text-white">Ford Transit Custom</p><span className="text-sm text-white/55">7100 Vejle</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
