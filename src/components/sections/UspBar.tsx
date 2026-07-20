import { Truck, Clock, CreditCard, Check, type LucideIcon } from "lucide-react";
import { Logos3 } from "@/components/ui/logos3";

const USPS: { Icon: LucideIcon; text: string }[] = [
  { Icon: Truck, text: "Gratis afhentning i hele Danmark" },
  { Icon: Clock, text: "Tilbud inden for få timer" },
  { Icon: CreditCard, text: "Betaling samme dag" },
  { Icon: Check, text: "Helt uforpligtende" },
];

// Samlet "trust-band": USP'er øverst + mærke-stribe nedenunder — lyst, så
// det matcher resten af siden.
export function UspBar() {
  return (
    <section className="border-y border-black/5 bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {USPS.map((usp, i) => {
            const { Icon } = usp;
            return (
              <div
                key={usp.text}
                className="reveal flex items-center gap-3"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <p className="text-sm font-semibold leading-tight text-ink">
                  {usp.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-10 border-t border-black/5 pt-8">
          <Logos3 />
        </div>
      </div>
    </section>
  );
}
