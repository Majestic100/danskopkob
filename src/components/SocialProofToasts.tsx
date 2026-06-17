import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";

// Lette social-proof-notifikationer der dukker op med jævne mellemrum.
const ACTIVITY = [
  { name: "Martin", city: "Aarhus", car: "VW Passat", ago: "2 min" },
  { name: "Louise", city: "Odense", car: "BMW 320d", ago: "6 min" },
  { name: "Peter", city: "Aalborg", car: "Audi A4", ago: "11 min" },
  { name: "Hanne", city: "Esbjerg", car: "Toyota Yaris", ago: "18 min" },
  { name: "Søren", city: "Vejle", car: "VW Transporter", ago: "24 min" },
  { name: "Camilla", city: "København", car: "Škoda Octavia", ago: "32 min" },
];

export function SocialProofToasts() {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let i = 0;
    let hideTimer = 0;
    let nextTimer = 0;
    const show = () => {
      setIndex(i % ACTIVITY.length);
      hideTimer = window.setTimeout(() => setIndex(null), 5200);
      nextTimer = window.setTimeout(() => {
        i += 1;
        show();
      }, 12000);
    };
    const startTimer = window.setTimeout(show, 4500);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, []);

  if (index === null) return null;
  const a = ACTIVITY[index];

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden max-w-[19rem] animate-in fade-in slide-in-from-bottom-3 duration-500 sm:block">
      <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-softlg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tp/10">
          <BadgeCheck className="h-5 w-5 text-tp" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">
            {a.name} fra {a.city}
          </p>
          <p className="text-xs text-ink/60">
            Fik et tilbud på sin {a.car} · for {a.ago} siden
          </p>
        </div>
      </div>
    </div>
  );
}
