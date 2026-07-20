import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  TestimonialCard,
  type TestimonialCardProps,
} from "@/components/ui/testimonial-card";

type Testimonial = Omit<TestimonialCardProps, "className">;

interface TestimonialsSectionProps {
  title: ReactNode;
  description: string;
  badge?: ReactNode; // fx Trustpilot-pill over overskriften
  stats?: ReactNode; // fx statistik-række under beskrivelsen
  testimonials: Testimonial[];
  className?: string;
}

// Ét uendeligt rullende bånd. To identiske halvdele giver sømløst loop;
// `reverse` vender retningen, så to rækker kan rulle mod hinanden.
function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: Testimonial[];
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div
      className="group flex flex-row overflow-hidden py-2 [--gap:1.25rem] [gap:var(--gap)]"
      style={{ "--duration": duration } as CSSProperties}
    >
      {[0, 1].map((half) => (
        <div
          key={half}
          aria-hidden={half === 1}
          className={cn(
            "flex shrink-0 flex-row justify-around [gap:var(--gap)] animate-marquee group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {[0, 1].map((setIndex) =>
            items.map((testimonial, i) => (
              <TestimonialCard key={`${half}-${setIndex}-${i}`} {...testimonial} />
            )),
          )}
        </div>
      ))}
    </div>
  );
}

// Tilpasset "testimonials-with-marquee": to bånd, der ruller hver sin vej,
// på en blød gradient-baggrund med farve-glød. Pause på hover; står stille
// ved prefers-reduced-motion.
export function TestimonialsSection({
  title,
  description,
  badge,
  stats,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  const mid = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, mid);
  const rowB = testimonials.slice(mid);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-white py-16 text-ink sm:py-24",
        className,
      )}
    >
      {/* Blød farve-glød i baggrunden */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-brand/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-trust/[0.07] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tp/[0.05] blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-12">
        <div className="reveal flex flex-col items-center gap-4 px-4 sm:gap-5">
          {badge}
          <h2 className="max-w-[760px] text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="max-w-[600px] text-ink/60 sm:text-lg">{description}</p>
          {stats}
        </div>

        <div className="reveal relative flex w-full flex-col items-center justify-center overflow-hidden">
          <MarqueeRow items={rowA} duration="65s" />
          {rowB.length > 0 && <MarqueeRow items={rowB} reverse duration="80s" />}

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-white sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-white sm:block" />
        </div>
      </div>
    </section>
  );
}
