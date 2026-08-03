import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const GAP = 16; // svarer til gap-4 i rækken

interface SwipeRowProps {
  /** Antal kort — bruges til "x af y"-tælleren */
  count: number;
  /** Tailwind-klasser for grid-opsætningen fra sm og op */
  gridClassName?: string;
  /** Ekstra klasser på selve rækken */
  className?: string;
  children: ReactNode;
}

/**
 * Vandret swipe-række på mobil, almindeligt grid fra sm og op.
 *
 * Baggrund: lange kort-lister (anmeldelser, videoer) fyldte flere tusinde
 * pixels på telefon, når kortene lå under hinanden. Her ligger de i en
 * snap-scroll-række i stedet. Pile + tæller er nødvendige, fordi et rent
 * swipe-hint er for let at overse — brugeren skal kunne SE, at der er mere.
 *
 * Kortene skal selv have `swipe-card`-klassen (bredde + snap).
 */
export function SwipeRow({
  count,
  gridClassName = "sm:grid-cols-2 lg:grid-cols-3",
  className,
  children,
}: SwipeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const onScroll = () => {
      const kort = row.firstElementChild as HTMLElement | null;
      if (!kort) return;
      const trin = kort.getBoundingClientRect().width + GAP;
      setAktiv(Math.round(row.scrollLeft / trin));
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, []);

  const gaaTil = (retning: -1 | 1) => {
    const row = rowRef.current;
    if (!row) return;
    const kort = row.firstElementChild as HTMLElement | null;
    if (!kort) return;
    row.scrollBy({
      left: retning * (kort.getBoundingClientRect().width + GAP),
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Pile + tæller — kun på mobil, hvor rækken kan scrolles */}
      <div className="mb-4 flex items-center gap-3 sm:hidden">
        <button
          type="button"
          onClick={() => gaaTil(-1)}
          aria-label="Forrige"
          disabled={aktiv === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink transition-colors active:bg-ink/10 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <span className="min-w-[4.5rem] text-sm font-semibold text-ink/60">
          {Math.min(aktiv + 1, count)} af {count}
        </span>
        <button
          type="button"
          onClick={() => gaaTil(1)}
          aria-label="Næste"
          disabled={aktiv >= count - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-soft transition-colors active:bg-brand/90 disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      <div
        ref={rowRef}
        className={cn(
          "no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2",
          "sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0",
          gridClassName,
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
