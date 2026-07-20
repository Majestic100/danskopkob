import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  TestimonialCard,
  type TestimonialCardProps,
} from "@/components/ui/testimonial-card";

interface TestimonialsSectionProps {
  title: string;
  description: string;
  badge?: ReactNode; // fx Trustpilot-logo + score over overskriften
  testimonials: Omit<TestimonialCardProps, "className">[];
  className?: string;
}

// Tilpasset "testimonials-with-marquee": uendeligt rullende anmeldelses-bånd.
// Kører via animate-marquee (tailwind.config.js); pauser på hover og står
// stille ved prefers-reduced-motion.
export function TestimonialsSection({
  title,
  description,
  badge,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section
      className={cn("bg-offwhite py-16 text-ink sm:py-24", className)}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-14">
        <div className="reveal flex flex-col items-center gap-4 px-4 sm:gap-5">
          {badge}
          <h2 className="max-w-[720px] text-3xl font-extrabold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-[600px] text-ink/60 sm:text-lg">{description}</p>
        </div>

        <div className="reveal relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex flex-row overflow-hidden p-2 [--duration:60s] [--gap:1.25rem] [gap:var(--gap)]">
            {/* To identiske halvdele à 2 sæt = sømløst loop */}
            {[0, 1].map((half) => (
              <div
                key={half}
                aria-hidden={half === 1}
                className="flex shrink-0 flex-row justify-around [gap:var(--gap)] animate-marquee group-hover:[animation-play-state:paused]"
              >
                {[0, 1].map((setIndex) =>
                  testimonials.map((testimonial, i) => (
                    <TestimonialCard
                      key={`${half}-${setIndex}-${i}`}
                      {...testimonial}
                    />
                  )),
                )}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-offwhite sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-offwhite sm:block" />
        </div>
      </div>
    </section>
  );
}
