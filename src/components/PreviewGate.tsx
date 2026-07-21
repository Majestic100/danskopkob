import { useEffect, useRef, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Adgangskoden til preview'et. Skift den her (og send den nye til dem, der
// skal have adgang). Direkte-link: <adresse>/?adgang=<kode>
const ADGANGSKODE = "minbilpris2026";
const STORAGE_KEY = "mbp-preview-adgang";

// Låseskærm mens sitet er i lukket preview. Fjernes når sitet skal gå
// offentligt live (slet <PreviewGate>-brugen i App.tsx + robots-blokering).
// OBS: dette er kunde-preview-beskyttelse, ikke rigtig sikkerhed.
export function usePreviewAccess(): [boolean, () => void] {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "ok",
  );

  useEffect(() => {
    if (unlocked) return;
    // Tillad direkte-link med koden: ?adgang=<kode>
    const params = new URLSearchParams(window.location.search);
    const kode = params.get("adgang");
    if (kode && kode === ADGANGSKODE) {
      localStorage.setItem(STORAGE_KEY, "ok");
      params.delete("adgang");
      const clean =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "") +
        window.location.hash;
      window.history.replaceState(null, "", clean);
      setUnlocked(true);
    }
  }, [unlocked]);

  return [unlocked, () => setUnlocked(true)];
}

export function PreviewGate({ onUnlock }: { onUnlock: () => void }) {
  const [kode, setKode] = useState("");
  const [fejl, setFejl] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kode.trim() === ADGANGSKODE) {
      localStorage.setItem(STORAGE_KEY, "ok");
      onUnlock();
    } else {
      setFejl(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink p-4">
      {/* Blød glød i baggrunden */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-trust/20 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-softlg">
        <p className="text-2xl font-extrabold tracking-tight text-ink">
          MinBil<span className="text-brand">Pris</span>
        </p>
        <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-ink/5">
          <Lock className="h-5 w-5 text-ink/60" />
        </div>
        <h1 className="mt-4 text-lg font-extrabold text-ink">Lukket preview</h1>
        <p className="mt-1.5 text-sm text-ink/60">
          Siden er ikke offentlig endnu. Indtast adgangskoden for at se den.
        </p>

        <form onSubmit={handleSubmit} className="mt-5">
          <input
            ref={inputRef}
            type="password"
            value={kode}
            onChange={(e) => {
              setKode(e.target.value);
              setFejl(false);
            }}
            placeholder="Adgangskode"
            aria-label="Adgangskode"
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3.5 text-center text-ink outline-none transition focus:ring-2",
              fejl
                ? "border-brand focus:ring-brand/20"
                : "border-black/10 focus:border-trust focus:ring-trust/20",
            )}
          />
          {fejl && (
            <p className="mt-2 text-sm font-medium text-brand">
              Forkert adgangskode — prøv igen.
            </p>
          )}
          <button
            type="submit"
            className="btn-cta mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-bold text-white shadow-soft"
          >
            Åbn siden
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </form>

        <p className="mt-5 text-xs text-ink/40">
          Har du ikke koden? Kontakt den, der sendte dig linket.
        </p>
      </div>
    </div>
  );
}
