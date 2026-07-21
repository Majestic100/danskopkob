import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatPlate, isValidEmail, isValidPlate } from "@/lib/form";

// EU-badge: blå plade med kreds af gule EU-stjerner + DK. Genbruges af
// salgsformularen på /saelg-din-bil.
export function PlateEuBadge() {
  return (
    <div className="plate__eu">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          return (
            <circle
              key={i}
              cx={12 + 7 * Math.cos(angle)}
              cy={12 + 7 * Math.sin(angle)}
              r={1.1}
              fill="#FFCC00"
            />
          );
        })}
      </svg>
      <span className="plate__dk">DK</span>
    </div>
  );
}

interface LeadFormProps {
  variant: "hero" | "cta";
  onSuccess: (plate: string) => void;
}

export function LeadForm({ variant, onSuccess }: LeadFormProps) {
  const [plate, setPlate] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInvalid(false);

    if (!isValidPlate(plate)) {
      setInvalid(true);
      setError("Indtast en gyldig dansk nummerplade, fx AB 12 345.");
      return;
    }
    if (email && !isValidEmail(email)) {
      setError("Indtast en gyldig emailadresse.");
      return;
    }

    // GHL: her kobles formularen til GoHighLevel via webhook/embed.
    onSuccess(plate.replace(/\s/g, ""));
    setPlate("");
    setName("");
    setTel("");
    setEmail("");
  };

  const euBadge = <PlateEuBadge />;

  const plateInput = (
    <input
      type="text"
      name="nummerplade"
      className="plate__input"
      placeholder="EF 11223"
      maxLength={7}
      size={7}
      autoComplete="off"
      aria-label="Nummerplade"
      value={plate}
      onChange={(e) => {
        setPlate(formatPlate(e.target.value));
        setInvalid(false);
      }}
      required
    />
  );

  if (variant === "hero") {
    return (
      <form className="w-full" noValidate onSubmit={handleSubmit}>
        {/* Integreret felt: EU-badge + input + knap i én rød-rammet pille */}
        <div className={cn("plate", invalid && "is-invalid")}>
          {euBadge}
          {plateInput}
          <button type="submit" className="plate__btn">
            Fortsæt
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-brand">{error}</p>
        )}
      </form>
    );
  }

  return (
    <form
      className="mx-auto mt-8 max-w-xl text-left"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="mb-3">
        <div className={cn("plate", invalid && "is-invalid")}>
          {euBadge}
          {plateInput}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          name="navn"
          placeholder="Dit navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl bg-white/95 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          type="tel"
          name="telefon"
          placeholder="Telefon"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          className="rounded-xl bg-white/95 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl bg-white/95 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      {error && (
        <p className="mt-2 rounded-lg bg-brand/80 px-3 py-2 text-sm font-medium text-white">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-cta mt-4 w-full rounded-xl bg-brand px-6 py-4 text-lg font-bold text-white shadow-soft"
      >
        Få mit tilbud nu
      </button>
      <p className="mt-3 text-center text-xs text-white/50">
        Ved at indsende accepterer du, at vi kontakter dig om dit tilbud. Helt
        uforpligtende.
      </p>
    </form>
  );
}
