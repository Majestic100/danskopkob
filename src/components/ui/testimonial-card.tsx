import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrustStars } from "@/components/icons";

export interface TestimonialAuthor {
  name: string;
  handle: string; // hos os: by + evt. "Verificeret" — vises under navnet
  avatar?: string; // valgfrit foto; ellers vises initialer
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  title?: string; // fed overskrift som på Trustpilot
  href?: string;
  className?: string;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Tilpasset "testimonial-card": Trustpilot-stjerner, anmeldelses-overskrift,
// stort citat-tegn og hover-løft. Initial-avatarer som i den øvrige
// anmeldelses-sektion (ingen stock-ansigter).
export function TestimonialCard({
  author,
  text,
  title,
  href,
  className,
}: TestimonialCardProps) {
  const Card = href ? "a" : "div";

  return (
    <Card
      {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "relative flex w-[300px] shrink-0 flex-col rounded-2xl sm:w-[340px]",
        "bg-white p-5 text-start shadow-soft ring-1 ring-black/5 sm:p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-softlg",
        className,
      )}
    >
      <Quote
        aria-hidden
        className="absolute right-5 top-5 h-8 w-8 -scale-x-100 text-brand/10"
        strokeWidth={1}
        fill="currentColor"
      />
      <TrustStars className="mb-3 flex" />
      {title && (
        <h3 className="mb-1.5 pr-8 font-bold leading-snug text-ink">{title}</h3>
      )}
      <p className="text-sm leading-relaxed text-ink/70">{text}</p>
      <div className="mt-auto flex items-center gap-3 pt-5">
        <Avatar className="h-10 w-10">
          {author.avatar && (
            <AvatarImage src={author.avatar} alt={author.name} />
          )}
          <AvatarFallback className="bg-trust/10 text-sm font-bold text-trust">
            {initials(author.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <p className="text-sm font-semibold leading-tight text-ink">
            {author.name}
          </p>
          <p className="text-xs text-ink/55">{author.handle}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-tp/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-tp">
          Verificeret
        </span>
      </div>
    </Card>
  );
}
