import { Play } from "lucide-react";

export function VideoReviews() {
  return (
    <section className="py-16 sm:py-24 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand mb-3">Hør det fra dem selv</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Videoanmeldelser fra rigtige sælgere</h2>
        </div>

        {/* SWAP: rigtige videoanmeldelser (thumbnail + videolink) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Video 1 */}
          <figure className="reveal group">
            <div className="zoom-wrap relative rounded-2xl overflow-hidden shadow-softlg cursor-pointer">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80" alt="Videoanmeldelse fra Jakob" loading="lazy" decoding="async" className="zoom-img w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/40 transition-colors flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-softlg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-brand ml-1" />
                </span>
              </div>
              <span className="absolute bottom-3 right-3 text-xs font-semibold bg-ink/70 rounded-md px-2 py-1">1:24</span>
            </div>
            <figcaption className="mt-3"><p className="font-semibold">Jakob Mortensen</p><p className="text-sm text-white/60">Roskilde</p></figcaption>
          </figure>

          {/* Video 2 */}
          <figure className="reveal group" style={{ transitionDelay: '90ms' }}>
            <div className="zoom-wrap relative rounded-2xl overflow-hidden shadow-softlg cursor-pointer">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80" alt="Videoanmeldelse fra Mette" loading="lazy" decoding="async" className="zoom-img w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/40 transition-colors flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-softlg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-brand ml-1" />
                </span>
              </div>
              <span className="absolute bottom-3 right-3 text-xs font-semibold bg-ink/70 rounded-md px-2 py-1">0:58</span>
            </div>
            <figcaption className="mt-3"><p className="font-semibold">Mette Sørensen</p><p className="text-sm text-white/60">Aarhus</p></figcaption>
          </figure>

          {/* Video 3 */}
          <figure className="reveal group" style={{ transitionDelay: '180ms' }}>
            <div className="zoom-wrap relative rounded-2xl overflow-hidden shadow-softlg cursor-pointer">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80" alt="Videoanmeldelse fra Anders" loading="lazy" decoding="async" className="zoom-img w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/40 transition-colors flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-softlg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-brand ml-1" />
                </span>
              </div>
              <span className="absolute bottom-3 right-3 text-xs font-semibold bg-ink/70 rounded-md px-2 py-1">1:47</span>
            </div>
            <figcaption className="mt-3"><p className="font-semibold">Anders Holm</p><p className="text-sm text-white/60">Kolding</p></figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
