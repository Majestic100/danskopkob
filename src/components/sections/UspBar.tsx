import { Truck, Clock, CreditCard, Check } from "lucide-react";

export function UspBar() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* USP 1 */}
          <div className="reveal flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-brand" />
            </div>
            <p className="text-sm font-semibold leading-tight">Gratis afhentning i hele Danmark</p>
          </div>
          {/* USP 2 */}
          <div className="reveal flex items-center gap-3" style={{ transitionDelay: '80ms' }}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-brand" />
            </div>
            <p className="text-sm font-semibold leading-tight">Tilbud inden for få timer</p>
          </div>
          {/* USP 3 */}
          <div className="reveal flex items-center gap-3" style={{ transitionDelay: '160ms' }}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-brand" />
            </div>
            <p className="text-sm font-semibold leading-tight">Betaling samme dag</p>
          </div>
          {/* USP 4 */}
          <div className="reveal flex items-center gap-3" style={{ transitionDelay: '240ms' }}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-brand" />
            </div>
            <p className="text-sm font-semibold leading-tight">Helt uforpligtende</p>
          </div>
        </div>
      </div>
    </section>
  );
}
