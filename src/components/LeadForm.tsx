import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function formatPlate(v: string) {
  return v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}
function isValidPlate(v: string) {
  return /^[A-Z]{2}[0-9]{4,5}$/.test(v.replace(/\s/g, "").toUpperCase());
}
function isValidEmail(v: string) {
  if (!v) return true; // email er valgfri i dette udkast
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
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
    if (!isValidEmail(email)) {
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

  const plateField = (
    <div className={cn("plate", variant === "hero" && "flex-1", invalid && "is-invalid")}>
      <div className="plate__eu">
        <span className="plate__stars">
          ★★★
          <br />
          ★★
        </span>
        <span className="plate__dk">DK</span>
      </div>
      <input
        type="text"
        name="nummerplade"
        className="plate__input"
        placeholder="AB 12 345"
        maxLength={7}
        autoComplete="off"
        aria-label="Nummerplade"
        value={plate}
        onChange={(e) => {
          setPlate(formatPlate(e.target.value));
          setInvalid(false);
        }}
        required
      />
    </div>
  );

  if (variant === "hero") {
    return (
      <form className="mt-7 max-w-lg" noValidate onSubmit={handleSubmit}>
        <label className="mb-2 block text-sm font-semibold text-ink">
          Indtast din nummerplade
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          {plateField}
          <button
            type="submit"
            className="btn-cta whitespace-nowrap rounded-xl bg-brand px-6 py-4 font-bold text-white shadow-soft"
          >
            Få mit tilbud
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm font-medium text-brand">{error}</p>
        )}
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-tp" strokeWidth={2.5} /> Gratis
            afhentning
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-tp" strokeWidth={2.5} />{" "}
            Uforpligtende
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-tp" strokeWidth={2.5} /> Svar inden
            for få timer
          </li>
        </ul>
      </form>
    );
  }

  return (
    <form
      className="mx-auto mt-8 max-w-xl text-left"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="mb-3">{plateField}</div>
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
