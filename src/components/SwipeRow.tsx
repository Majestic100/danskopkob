import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const GAP = 16; // svarer til gap-4 i rækken

interface SwipeRowProps {
  /** Antal kort — bruges til prikkerne */
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
 * snap-scroll-række i stedet.
 *
 * Betjeningen er bevidst diskret og symmetrisk: to ens pile omkring en
 * række prikker. Tidligere var "næste" en stor rød cirkel ved siden af en
 * grå — det så skævt ud. Prikkerne viser position og kan klikkes.
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

  const trinBredde = () => {
    const row = rowRef.current;
    const kort = row?.firstElementChild as HTMLElement | null;
    return kort ? kort.getBoundingClientRect().width + GAP : 0;
  };

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const onScroll = () => {
      const trin = trinBredde();
      if (trin) setAktiv(Math.round(row.scrollLeft / trin));
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, []);

  const gaaTil = (retning: -1 | 1) =>
    rowRef.current?.scrollBy({
      left: retning * trinBredde(),
      behavior: "smooth",
    });

  const gaaTilIndex = (i: number) =>
    rowRef.current?.scrollTo({ left: i * trinBredde(), behavior: "smooth" });

  const knapCls =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-sm ring-1 ring-black/10 transition active:scale-95 disabled:opacity-30 disabled:shadow-none";

  return (
    <>
      {/* Betjening — kun på mobil, hvor rækken kan scrolles */}
      <div className="mb-4 flex items-center justify-center gap-4 sm:hidden">
        <button
          type="button"
          onClick={() => gaaTil(-1)}
          aria-label="Forrige"
          disabled={aktiv === 0}
          className={knapCls}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-1.5" role="tablist">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Gå til ${i + 1} af ${count}`}
              aria-selected={i === aktiv}
              onClick={() => gaaTilIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === aktiv ? "w-5 bg-brand" : "w-1.5 bg-ink/20",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => gaaTil(1)}
          aria-label="Næste"
          disabled={aktiv >= count - 1}
          className={knapCls}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
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
