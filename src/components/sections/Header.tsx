import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL;

// Sektions-ankre peger på forsiden med fuld sti, så de også virker fra
// undersider som /blog. Fra forsiden er det samme dokument → ren scroll.
const NAV: { label: string; href?: string; to?: string }[] = [
  { label: "Sådan virker det", href: `${BASE}#saadan-virker-det` },
  { label: "Anmeldelser", href: `${BASE}#anmeldelser` },
  { label: "Dækning", href: `${BASE}#daekning` },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", href: `${BASE}#faq` },
];

function NavItem({
  item,
  className,
  onClick,
}: {
  item: (typeof NAV)[number];
  className: string;
  onClick?: () => void;
}) {
  if (item.to) {
    return (
      <Link to={item.to} onClick={onClick} className={className}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} onClick={onClick} className={className}>
      {item.label}
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex select-none items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              MinBil<span className="text-brand">Pris</span>
            </span>
            <span className="hidden rounded-full border border-trust/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-trust sm:inline-block">
              Danmark
            </span>
          </Link>

          {/* Desktop-navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                className="text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
              />
            ))}
          </nav>

          {/* Handlinger */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="tel:+4570605040"
              className="hidden items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-brand md:flex"
            >
              <Phone className="h-4 w-4" /> 70 60 50 40
            </a>
            <a
              href={`${BASE}#tilbud`}
              className="btn-cta hidden items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-soft sm:inline-flex"
            >
              Få tilbud
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </a>

            {/* Hamburger (mobil) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Luk menu" : "Åbn menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-offwhite lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil-menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-black/5 bg-white transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-offwhite"
            />
          ))}
          <a
            href="tel:+4570605040"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-offwhite"
          >
            <Phone className="h-4 w-4" /> 70 60 50 40
          </a>
          <a
            href={`${BASE}#tilbud`}
            onClick={() => setOpen(false)}
            className="btn-cta mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-bold text-white shadow-soft"
          >
            Få tilbud
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </nav>
      </div>
    </header>
  );
}
